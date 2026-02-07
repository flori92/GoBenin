import Constants from 'expo-constants';
import { createClient } from '@supabase/supabase-js';

const config = Constants.expoConfig?.extra ?? {};
const supabaseUrl = config.supabaseUrl || '';
const supabaseAnonKey = config.supabaseAnonKey || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
