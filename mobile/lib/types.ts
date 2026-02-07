export type NotificationType = 'booking' | 'promo' | 'price' | 'reminder' | 'system';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  created_at: string;
  read_at: string | null;
  data?: Record<string, unknown>;
}

export interface BookingItem {
  id: string;
  title: string;
  date_label: string;
  guests_label: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  provider: string;
  total_price: string;
}
