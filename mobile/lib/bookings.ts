import { supabase } from './supabase';
import { BookingItem } from './types';

const formatDateLabel = (dateISO: string, time?: string | null) => {
  const date = new Date(dateISO);
  if (Number.isNaN(date.getTime())) return dateISO;
  const formatted = date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return time ? `${formatted} • ${time}` : formatted;
};

const formatGuests = (guests: number) => `${guests} guest${guests > 1 ? 's' : ''}`;

const formatPrice = (value?: number | null, currency = 'XOF') => {
  if (!value) return 'Contact for price';
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

export const fetchUserBookings = async (userId: string): Promise<BookingItem[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('id, date, time, guests, status, total_price, destination_id, tour_id, destinations(name_en, name_fr), tours(name_en, name_fr)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((item: any) => {
    const title = item.destinations?.name_en || item.tours?.name_en || 'Booking';
    const dateLabel = formatDateLabel(item.date, item.time);
    return {
      id: item.id,
      title,
      date_label: dateLabel,
      guests_label: formatGuests(item.guests || 1),
      status: item.status || 'confirmed',
      provider: 'GoBenin',
      total_price: formatPrice(item.total_price, 'XOF'),
    } as BookingItem;
  });
};
