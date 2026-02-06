
export interface Location {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  rating: number;
  reviews: number;
  image: string;
  category: 'Heritage' | 'Nature' | 'Culture' | 'Relaxation' | 'Hotel' | 'Food';
  price?: string;
  distance?: string;
  lat?: number;
  lng?: number;
  images?: readonly string[];
  features?: readonly { icon: string; label: string }[];
  hours?: string;
  duration?: string;
}

export interface Tour {
  id: string;
  name: string;
  location: string;
  rating: number;
  duration: string;
  distance: string;
  stops: number;
  price: number;
  image: string;
  tags: readonly string[];
  description: string;
  stopNames: readonly string[];
}

export interface Booking {
  id: string;
  title: string;
  date: string;
  time: string;
  guests: string;
  status: 'Confirmed' | 'Pending' | 'Past';
  image: string;
}

export type ViewState = 'SPLASH' | 'HOME' | 'MAP' | 'TOURS' | 'BOOKINGS' | 'DETAILS' | 'PROFILE';
