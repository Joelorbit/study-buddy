import React, { useState } from 'react';
import PomodoroTimer from './PomodoroTimer';
import StreakTracker from './StreakTracker';
import AiChat from './AiChat';
import ExamPrep from './ExamPrep';
import { AppView, TimerMode } from '../types';
import { useStreak } from '../hooks/useStreak';
import { useTimer } from '../hooks/useTimer';
import TimerIcon from './icons/TimerIcon';
import FlameIcon from './icons/FlameIcon';
import ChatIcon from './icons/ChatIcon';
import CalendarIcon from './icons/CalendarIcon';
import { useAuth } from '../contexts/AuthContext';
import SignOutIcon from './icons/SignOutIcon';

interface NavItemProps {
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
    ariaLabel: string;
}

const NavItem: React.FC<NavItemProps> = ({ isActive, onClick, children, ariaLabel }) => (
    <button
        onClick={onClick}
        aria-label={ariaLabel}
        className={`flex flex-col items-center justify-center p-2 w-24 h-20 rounded-2xl transition-all duration-300 transform hover:scale-105
        ${isActive ? 'bg-brand-primary text-white shadow-lg' : 'bg-dark-card hover:bg-gray-700 text-dark-subtle'}`}
    >
        {children}
    </button>
);

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};


const StudyBuddyApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.TIMER);
  const { streak, handleWorkSessionComplete, isLoading: isStreakLoading } = useStreak();
  const { session, signOut } = useAuth();
  const { timeLeft, isActive: isTimerActive, mode, totalDuration, toggleTimer, reset } = useTimer(handleWorkSessionComplete);

  const welcomeName = session?.user.email.split('@')[0] || 'User';

  const renderView = () => {
    switch (currentView) {
      case AppView.TIMER:
        return <PomodoroTimer {...{ timeLeft, isActive: isTimerActive, mode, totalDuration, toggleTimer, reset }} />;
      case AppView.STREAK:
        return <StreakTracker />;
      case AppView.CHAT:
        return <AiChat />;
      case AppView.EXAM_PREP:
        return <ExamPrep />;
      default:
        return <PomodoroTimer {...{ timeLeft, isActive: isTimerActive, mode, totalDuration, toggleTimer, reset }} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4">
        <header className="w-full max-w-lg text-center mb-8 relative">
            <h1 className="text-5xl font-extrabold text-white">
                Study<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Buddy</span>
            </h1>
            <p className="text-dark-subtle mt-2">Welcome, <span className="font-semibold text-dark-text capitalize">{welcomeName}</span></p>
            <button
              onClick={signOut}
              className="absolute top-0 right-0 mt-1 p-3 text-dark-subtle bg-dark-card rounded-full hover:bg-red-700/50 hover:text-white transition-colors duration-200"
              aria-label="Sign Out"
            >
              <SignOutIcon className="w-6 h-6" />
            </button>
        </header>

        <main className="w-full h-[600px] flex items-center justify-center">
            {renderView()}
        </main>

        <nav className="mt-8 flex items-center space-x-4 p-3 bg-dark-card/50 rounded-full backdrop-blur-sm shadow-inner">
            <NavItem 
                isActive={currentView === AppView.TIMER} 
                onClick={() => setCurrentView(AppView.TIMER)}
                ariaLabel="Timer View"
            >
                {isTimerActive ? (
                    <div className="relative flex flex-col items-center justify-center space-y-1">
                        <span className="text-lg font-bold tabular-nums">{formatTime(timeLeft)}</span>
                        <span className="text-xs font-semibold uppercase tracking-wider">{mode === TimerMode.WORK ? 'Focus' : 'Break'}</span>
                        <span className="absolute top-0 right-0 -mr-2 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    </div>
                ) : (
                    <>
                        <TimerIcon className="w-7 h-7" />
                        <span className="text-xs font-semibold uppercase tracking-wider mt-2">Timer</span>
                    </>
                )}
            </NavItem>
             <NavItem 
                isActive={currentView === AppView.EXAM_PREP} 
                onClick={() => setCurrentView(AppView.EXAM_PREP)} 
                ariaLabel="Exam Prep View"
            >
                <CalendarIcon className="w-7 h-7" /> 
                <span className="text-xs font-semibold uppercase tracking-wider mt-2">Exam Prep</span>
            </NavItem>
            <div className="relative">
                <NavItem 
                    isActive={currentView === AppView.STREAK} 
                    onClick={() => setCurrentView(AppView.STREAK)} 
                    ariaLabel="Streak View"
                >
                     <FlameIcon className="w-7 h-7" /> 
                     <span className="text-xs font-semibold uppercase tracking-wider mt-2">Streak</span>
                </NavItem>
                {streak > 0 && !isStreakLoading && (
                    <div className="absolute -top-2 -right-2 bg-brand-secondary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-dark-card/50">
                        {streak}
                    </div>
                )}
            </div>
            <NavItem 
                isActive={currentView === AppView.CHAT} 
                onClick={() => setCurrentView(AppView.CHAT)} 
                ariaLabel="AI Chat View"
            >
                <ChatIcon className="w-7 h-7" />
                <span className="text-xs font-semibold uppercase tracking-wider mt-2">AI Chat</span>
            </NavItem>
        </nav>
    </div>
  );
};

export default StudyBuddyApp;