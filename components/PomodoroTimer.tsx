import React from 'react';
import { TimerMode } from '../types';

interface PomodoroTimerProps {
  timeLeft: number;
  isActive: boolean;
  mode: TimerMode;
  totalDuration: number;
  toggleTimer: () => void;
  reset: () => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ timeLeft, isActive, mode, totalDuration, toggleTimer, reset }) => {

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-dark-card rounded-3xl shadow-2xl h-full w-full max-w-lg mx-auto">
      <div className="relative w-80 h-80">
        <svg className="w-full h-full" viewBox="0 0 300 300">
          <circle
            cx="150"
            cy="150"
            r="140"
            stroke="#374151"
            strokeWidth="15"
            fill="transparent"
          />
          <circle
            cx="150"
            cy="150"
            r="140"
            stroke="url(#gradient)"
            strokeWidth="15"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 150 150)"
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
          <p className={`text-7xl font-bold tracking-tighter ${mode === TimerMode.WORK ? 'text-brand-primary' : 'text-brand-secondary'}`}>
            {formatTime(timeLeft)}
          </p>
          <p className="text-xl font-semibold text-dark-subtle mt-2 uppercase tracking-widest">
            {mode === TimerMode.WORK ? 'Focus' : 'Break'}
          </p>
        </div>
      </div>

      <div className="flex space-x-6 mt-12">
        <button
          onClick={toggleTimer}
          className={`px-10 py-4 text-xl font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg
          ${isActive 
            ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
            : 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white'}`}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={reset}
          className="px-10 py-4 text-xl font-bold rounded-full bg-gray-600 hover:bg-gray-700 text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;