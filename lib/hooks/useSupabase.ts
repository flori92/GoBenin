import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { Language, useLanguage } from '../../contexts/LanguageContext';

// Types
export interface Destination {
  id: string;
  name_en: string;
  name_fr: string;
  subtitle_en: string | null;
  subtitle_fr: string | null;
  description_en: string | null;
  description_fr: string | null;
  rating: number;
  reviews_count: number;
  image: string | null;
  category: string;
  type: 'featured' | 'heritage' | 'nearby';
  price: string | null;
  hours: string | null;
  duration: string | null;
  distance: string | null;
  features: { icon: string; label: string }[];
  images: string[];
  coords: { lat: number; lng: number } | null;
}

export interface Tour {
  id: string;
  name_en: string;
  name_fr: string;
  description_en: string | null;
  description_fr: string | null;
  duration: string;
  stops: number;
  price: number | null;
  image: string | null;
  tags: string[];
  stop_names: string[];
}

// Helper to format destination for UI
export const formatDestination = (dest: Destination, lang: Language) => ({
  id: dest.id,
  name: lang === 'fr' ? dest.name_fr : dest.name_en,
  subtitle: lang === 'fr' ? dest.subtitle_fr : dest.subtitle_en,
  description: lang === 'fr' ? dest.description_fr : dest.description_en,
  rating: dest.rating,
  reviews: dest.reviews_count,
  image: dest.image,
  category: dest.category,
  price: dest.price,
  hours: dest.hours,
  duration: dest.duration,
  distance: dest.distance,
  features: dest.features,
  images: dest.images,
  coords: dest.coords,
});

export const formatTour = (tour: Tour, lang: Language) => ({
  id: tour.id,
  name: lang === 'fr' ? tour.name_fr : tour.name_en,
  description: lang === 'fr' ? tour.description_fr : tour.description_en,
  duration: tour.duration,
  stops: tour.stops,
  price: tour.price,
  image: tour.image,
  tags: tour.tags,
  stopNames: tour.stop_names,
});

// Hook pour les destinations
export function useDestinations(type?: 'featured' | 'heritage' | 'nearby') {
  const { t } = useLanguage();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        let query = supabase.from('destinations').select('*');
        
        if (type) {
          query = query.eq('type', type);
        }
        
        const { data, error } = await query.order('rating', { ascending: false });
        
        if (error) throw error;
        setDestinations(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('load_error'));
        console.error('Error fetching destinations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [type]);

  return { destinations, loading, error };
}

// Hook pour les tours
export function useTours() {
  const { t } = useLanguage();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tours')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setTours(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('load_error'));
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  return { tours, loading, error };
}

// Hook pour la recherche
export function useSearch(query: string, lang: Language) {
  const { t } = useLanguage();
  const [results, setResults] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchDestinations = async () => {
      setLoading(true);
      try {
        const searchField = lang === 'fr' ? 'name_fr' : 'name_en';
        const descField = lang === 'fr' ? 'description_fr' : 'description_en';
        
        const { data, error } = await supabase
          .from('destinations')
          .select('*')
          .or(`${searchField}.ilike.%${query}%,${descField}.ilike.%${query}%,category.ilike.%${query}%`);
        
        if (error) throw error;
        setResults(data || []);
      } catch (err) {
        console.error(t('search_error'), err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchDestinations, 300);
    return () => clearTimeout(debounce);
  }, [query, lang]);

  return { results, loading };
}

// Hook pour les réservations utilisateur
export function useUserBookings(userId: string | null) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!userId) {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          destinations (name_en, name_fr, image),
          tours (name_en, name_fr, image)
        `)
        .eq('user_id', userId)
        .order('date', { ascending: true });
      
      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const createBooking = async (booking: {
    destination_id?: string;
    tour_id?: string;
    date: string;
    time?: string;
    guests: number;
    total_price?: number;
  }) => {
    if (!userId) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('bookings')
      .insert([{ ...booking, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    await fetchBookings();
    return data;
  };

  const cancelBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);
    
    if (error) throw error;
    await fetchBookings();
  };

  return { bookings, loading, createBooking, cancelBooking, refetch: fetchBookings };
}

// Hook pour les favoris
export function useFavorites(userId: string | null) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('destination_id, tour_id')
          .eq('user_id', userId);
        
        if (error) throw error;
        const ids = data?.map(f => f.destination_id || f.tour_id).filter(Boolean) || [];
        setFavorites(ids as string[]);
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  const toggleFavorite = async (destinationId?: string, tourId?: string) => {
    if (!userId) return;
    
    const id = destinationId || tourId;
    const isFavorite = favorites.includes(id!);
    
    if (isFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq(destinationId ? 'destination_id' : 'tour_id', id);
      
      if (!error) {
        setFavorites(prev => prev.filter(f => f !== id));
      }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert([{
          user_id: userId,
          destination_id: destinationId,
          tour_id: tourId
        }]);
      
      if (!error) {
        setFavorites(prev => [...prev, id!]);
      }
    }
  };

  return { favorites, loading, toggleFavorite, isFavorite: (id: string) => favorites.includes(id) };
}
