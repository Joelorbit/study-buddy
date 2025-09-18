import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Landing from './Landing';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    const action = isLogin ? signIn : signUp;
    const { error: authError } = await action(email, password);
    
    if (authError) {
      setError(authError);
    }
    setLoading(false);
  };

  const handleShowLogin = () => {
    setIsLogin(true);
    setShowAuthForm(true);
  };

  const handleShowSignUp = () => {
    setIsLogin(false);
    setShowAuthForm(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-transparent">
        {!showAuthForm ? (
            <Landing onLogin={handleShowLogin} onStartFree={handleShowSignUp} />
        ) : (
             <div className="w-full max-w-md">
                 <div className="w-full p-8 bg-dark-card rounded-3xl shadow-2xl">
                    <h2 className="text-3xl font-bold text-center text-white mb-2">{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
                    <p className="text-center text-dark-subtle mb-8">{isLogin ? 'Sign in to continue your journey.' : 'Join to start your focus journey.'}</p>
                    
                    {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-center">{error}</p>}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-dark-subtle mb-2">Email Address</label>
                        <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-brand-primary focus:border-brand-primary transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-dark-subtle mb-2">Password</label>
                        <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-brand-primary focus:border-brand-primary transition"
                        />
                    </div>
                    <div>
                        <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-300"
                        >
                        {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (isLogin ? 'Sign In' : 'Sign Up')}
                        </button>
                    </div>
                    </form>
                    
                    <p className="mt-8 text-center text-sm text-dark-subtle">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="font-semibold text-brand-primary hover:text-brand-primary/80 ml-2">
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                    </p>
                </div>
             </div>
        )}
    </div>
  );
};

export default Auth;