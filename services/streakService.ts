import { supabase } from './supabaseClient';

export interface StreakData {
    current_streak: number;
    last_completed_date: string | null;
}

export const streakService = {
    getStreak: async (): Promise<StreakData> => {
        const { data, error } = await supabase
            .from('streaks')
            .select('current_streak, last_completed_date')
            .single();

        // 'PGRST116' is the code for 'single row not found', which is expected for new users.
        if (error && error.code !== 'PGRST116') { 
            console.error('Error fetching streak:', error);
            // Re-throw a more informative error to be caught by the calling hook.
            throw new Error(`Failed to fetch streak data. ${error.message}`);
        }

        if (!data) {
            return { current_streak: 0, last_completed_date: null };
        }

        return data;
    },

    incrementStreak: async (): Promise<StreakData> => {
        // Calls the 'handle_streak_increment' function created in the Supabase SQL Editor.
        const { data, error } = await supabase.rpc('handle_streak_increment');

        if (error) {
            console.error('Error incrementing streak:', error);
            throw new Error(`Failed to increment streak. ${error.message}`);
        }
        
        if (!data || data.length === 0) {
             throw new Error("Failed to increment streak: RPC returned no data.");
        }
        
        // The RPC function returns an array containing a single object with the new streak data.
        const result = data[0];
        
        return {
            current_streak: result.new_streak,
            last_completed_date: result.new_date
        };
    },
};