import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Config } from '@/constants/config';

// Create Supabase client with persistent AsyncStorage auth storage
export const supabase = createClient(
  Config.supabaseUrl || 'https://placeholder.supabase.co',
  Config.supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
