import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qdueesyzwcpjwtmninez.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (import.meta.env.DEV && !supabaseAnonKey) {
  console.warn('[GoBenin] Missing VITE_SUPABASE_ANON_KEY. Auth and data calls will fail.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour les données GoBénin
export interface Destination {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  price?: string;
  hours?: string;
  duration?: string;
  features?: { icon: string; label: string }[];
  images?: string[];
  coords?: { lat: number; lng: number };
}

export interface Tour {
  id: string;
  name: string;
  duration: string;
  stops: number;
  price: number;
  image: string;
  tags: string[];
  description: string;
  stopNames: string[];
}

export interface Booking {
  id: string;
  user_id?: string;
  destination_id: string;
  destination_name: string;
  date: string;
  time: string;
  guests: number;
  status: 'upcoming' | 'past' | 'cancelled';
  image: string;
  created_at?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  phone?: string;
  country?: string;
  trips_count: number;
  reviews_count: number;
  points: number;
  explorer_level: number;
  badges: string[];
  created_at: string;
}
