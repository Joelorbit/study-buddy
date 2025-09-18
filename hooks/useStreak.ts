import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { streakService } from '../services/streakService';

export const useStreak = () => {
  const { session } = useAuth();
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStreak = useCallback(async () => {
    if (!session) {
        setStreak(0);
        setIsLoading(false);
        return;
    };
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await streakService.getStreak();
      setStreak(data.current_streak);
    } catch (error) {
      console.error("Failed to fetch streak data:", error);
      setError((error as Error).message);
      setStreak(0); // Reset on error
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  const handleWorkSessionComplete = useCallback(async () => {
    if (!session) return;

    try {
      setError(null);
      const data = await streakService.incrementStreak();
      setStreak(data.current_streak);
    } catch (error) {
      console.error("Failed to increment streak:", error);
      setError((error as Error).message);
    }
  }, [session]);

  return { streak, handleWorkSessionComplete, isLoading, error };
};