import { BookingItem } from './types';

export const getSampleBookings = (): BookingItem[] => [
  {
    id: 'bk-1',
    title: 'Maison de la Plage, Ouidah',
    date_label: '12-15 Oct 2026',
    guests_label: '2 guests',
    status: 'confirmed',
    provider: 'Airbnb',
    total_price: 'XOF 142,000',
  },
  {
    id: 'bk-2',
    title: 'Hotel Azhala, Cotonou',
    date_label: '20-23 Nov 2026',
    guests_label: '1 guest',
    status: 'pending',
    provider: 'Booking.com',
    total_price: 'XOF 98,000',
  },
];
