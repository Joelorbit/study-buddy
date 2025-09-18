import React from 'react';
import BookOpenIcon from './icons/BookOpenIcon';

interface LandingProps {
    onLogin: () => void;
    onStartFree: () => void;
}

const Landing: React.FC<LandingProps> = ({ onLogin, onStartFree }) => {
    return (
        <div className="w-full max-w-sm text-center bg-dark-card rounded-2xl shadow-xl p-8 relative border border-gray-800/60 font-sans" style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.03em' }}>
            <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center bg-gray-900 rounded-full border border-brand-primary/30">
                <BookOpenIcon className="w-7 h-7 text-brand-primary" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Study <span className="text-brand-primary">Buddy</span>
            </h1>
            <p className="text-dark-subtle text-base mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
                Your AI-powered companion for focus, streaks, and smarter studying.
            </p>
            <div className="flex flex-col gap-3">
                <button
                    onClick={onStartFree}
                    className="w-full py-2.5 px-4 text-base font-semibold text-white bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg shadow transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                >
                    Start for Free
                </button>
                <button
                    onClick={onLogin}
                    className="w-full py-2.5 px-4 text-base font-semibold text-dark-text bg-gray-700 rounded-lg shadow transition-all duration-300 ease-in-out hover:bg-gray-600 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/10"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                >
                    I have an account
                </button>
            </div>
        </div>
    );
};

export default Landing;