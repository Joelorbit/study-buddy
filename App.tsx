import React from 'react';
import { useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import StudyBuddyApp from './components/StudyBuddyApp';

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-dark-bg">
    <div className="w-16 h-16 border-4 border-t-4 border-gray-600 border-t-brand-primary rounded-full animate-spin"></div>
  </div>
);

const App: React.FC = () => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen font-sans bg-transparent">
        {session ? <StudyBuddyApp /> : <Auth />}
    </div>
  );
};

export default App;