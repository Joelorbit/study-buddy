import { createClient } from '@supabase/supabase-js';

// Credentials are provided directly for this environment.
export const supabaseUrl = 'https://zhroqpezsrlodckjecva.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpocm9xcGV6c3Jsb2Rja2plY3ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjI0MzIsImV4cCI6MjA3Mzc5ODQzMn0.V91V0MExp6ASujeepHGRQMcK305vrXZ5NGiuJM5LvxE';

// Initialize the Supabase client.
export const supabase = createClient(supabaseUrl, supabaseKey);