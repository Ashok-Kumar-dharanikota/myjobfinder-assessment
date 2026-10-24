/**
 * Application runtime configuration
 * Safely accesses EXPO_PUBLIC_* environment variables
 */
export const Config = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  isConfigured(): boolean {
    return Boolean(this.supabaseUrl && this.supabaseAnonKey);
  },
};
