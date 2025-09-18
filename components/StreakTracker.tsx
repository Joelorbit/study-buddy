import React from 'react';
import { useStreak } from '../hooks/useStreak';
import FlameIcon from './icons/FlameIcon';
import { supabaseUrl } from '../services/supabaseClient';

interface BadgeProps {
  days: number;
  achieved: boolean;
  label: string;
}

const MilestoneBadge: React.FC<BadgeProps> = ({ days, achieved, label }) => (
    <div className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 ${achieved ? 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/30' : 'border-gray-600 bg-gray-700/50'}`}>
        <div className={`text-4xl font-bold ${achieved ? 'text-amber-400' : 'text-gray-400'}`}>{days}</div>
        <div className={`text-sm font-semibold uppercase tracking-wider ${achieved ? 'text-amber-300' : 'text-gray-500'}`}>{label}</div>
    </div>
);


const StreakTracker: React.FC = () => {
  const { streak, isLoading, error } = useStreak();

  const milestones = [
    { days: 3, label: '3-Day Fire' },
    { days: 7, label: 'Week Streak' },
    { days: 30, label: 'Month Focus' },
    { days: 100, label: 'Centurion' },
  ];
  
  const renderContent = () => {
    if (isLoading) {
      return <div className="w-16 h-16 border-4 border-t-4 border-gray-600 border-t-brand-primary rounded-full animate-spin"></div>;
    }
    
    if (error) {
      // Expected format: https://<ref>.supabase.co -> extracts the <ref>
      const supabaseProjectRef = supabaseUrl.split('.')[0].replace('https://', '');
      const sqlEditorUrl = `https://app.supabase.com/project/${supabaseProjectRef}/sql/new`;


      return (
        <div className="text-center bg-red-900/50 border border-red-700 rounded-lg p-6 max-w-sm">
            <h3 className="text-xl font-bold text-red-300 mb-2">Database Setup Needed</h3>
            <p className="text-red-400 mb-4">
                The app can't find the `streaks` table. This means the initial database setup script needs to be run.
            </p>
            <div className="text-left text-sm text-gray-300 space-y-3 mb-6 bg-gray-800/50 p-4 rounded-lg">
                <p><strong>1. Next Step:</strong> Click the button below to open your Supabase SQL Editor.</p>
                <p><strong>2. Then:</strong> Paste and run the SQL script from our chat to create the table.</p>
                <p><strong>3. If it still fails:</strong> Go to your project's `API Docs` section and click `Reload schema`.</p>
            </div>
            <a 
                href={sqlEditorUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block w-full px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg shadow-lg hover:opacity-90 transition-opacity"
            >
                Open Supabase SQL Editor
            </a>
        </div>
      );
    }
    
    return (
      <>
        <FlameIcon className={`w-24 h-24 transition-colors duration-500 ${streak > 0 ? 'text-brand-secondary' : 'text-gray-600'}`} />
        <div className="text-center">
            <p className="text-8xl font-black text-white">{streak}</p>
            <p className="text-2xl font-semibold text-dark-subtle -mt-2">Day Streak</p>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-dark-card rounded-3xl shadow-2xl h-full w-full max-w-lg mx-auto">
        <h2 className="text-3xl font-bold text-dark-text mb-4">Daily Streak</h2>
        <p className="text-dark-subtle mb-8">Complete at least one focus session each day to keep the flame alive!</p>

        <div className="flex items-center justify-center space-x-6 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 p-8 rounded-full mb-12 min-h-[160px] w-full max-w-md">
            {renderContent()}
        </div>

        <h3 className="text-2xl font-bold text-dark-text mb-6">Milestones</h3>
        <div className="grid grid-cols-4 gap-4 w-full">
            {milestones.map(milestone => (
                <MilestoneBadge 
                    key={milestone.days} 
                    days={milestone.days} 
                    label={milestone.label}
                    achieved={!isLoading && !error && streak >= milestone.days} 
                />
            ))}
        </div>
    </div>
  );
};

export default StreakTracker;