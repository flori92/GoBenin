import { Location, BookingProvider } from '../types';

export type BookingAvailability = 'Available' | 'Limited' | 'Sold Out';
export type BookingCancellation = 'Flexible' | 'Moderate' | 'Strict';

export interface BookingSearchParams {
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface BookingOffer {
  provider: BookingProvider;
  nightlyPrice: number;
  totalPrice: number;
  rating: number;
  reviews: number;
  cancellation: BookingCancellation;
  availability: BookingAvailability;
  perks: string[];
  cleaningFee: number;
  serviceFee: number;
  taxesFee: number;
  currency: 'XOF' | 'USD';
  score: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const seededNumber = (seed: number, min: number, max: number) => {
  const normalized = (Math.sin(seed) + 1) / 2;
  return min + normalized * (max - min);
};

export const getStayNights = (checkIn: string, checkOut: string) => {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  if (Number.isNaN(inDate.getTime()) || Number.isNaN(outDate.getTime())) return 1;
  const diff = Math.max(outDate.getTime() - inDate.getTime(), 0);
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 1);
};

const getBasePrice = (location: Location, currency: 'XOF' | 'USD') => {
  if (location.priceAmount) return location.priceAmount;
  return currency === 'XOF' ? 32000 : 65;
};

const getAvailability = (seed: number): BookingAvailability => {
  const bucket = seed % 10;
  if (bucket < 2) return 'Sold Out';
  if (bucket < 5) return 'Limited';
  return 'Available';
};

const getCancellation = (seed: number): BookingCancellation => {
  const bucket = seed % 3;
  if (bucket === 0) return 'Flexible';
  if (bucket === 1) return 'Moderate';
  return 'Strict';
};

const PROVIDER_PERKS: Record<BookingProvider, string[]> = {
  Airbnb: ['Self check-in', 'Local host tips', 'Unique stays'],
  'Booking.com': ['Free breakfast', 'Pay at property', '24h support'],
  GoBenin: ['Local concierge', 'Premium transfers', 'VIP access'],
};

export const generateBookingOffers = (location: Location, params: BookingSearchParams): BookingOffer[] => {
  const currency: 'XOF' | 'USD' = location.priceCurrency || 'XOF';
  const nights = getStayNights(params.checkIn, params.checkOut);
  const basePrice = getBasePrice(location, currency);

  const providers: BookingProvider[] = ['Airbnb', 'Booking.com'];

  const offers = providers.map((provider, index) => {
    const seed = hashString(`${location.id}-${provider}-${params.checkIn}-${params.checkOut}`);
    const nightlyMultiplier = provider === 'Airbnb' ? 1.04 : 0.98;
    const seasonalAdjustment = seededNumber(seed + 12, 0.9, 1.15);
    const guestAdjustment = 1 + Math.max(params.guests - 2, 0) * 0.08;
    const nightlyPrice = Math.round(basePrice * nightlyMultiplier * seasonalAdjustment * guestAdjustment);
    const cleaningFee = Math.round(nightlyPrice * seededNumber(seed + 31, 0.08, 0.18));
    const serviceFee = Math.round(nightlyPrice * nights * seededNumber(seed + 57, 0.1, 0.18));
    const taxesFee = Math.round(nightlyPrice * nights * seededNumber(seed + 93, 0.06, 0.12));
    const totalPrice = nightlyPrice * nights + cleaningFee + serviceFee + taxesFee;
    const rating = clamp(seededNumber(seed + 7, 4.1, 4.95), 4.1, 4.95);
    const reviews = Math.round(seededNumber(seed + 3, 120, 980));
    const availability = getAvailability(seed + index);
    const cancellation = getCancellation(seed + index * 3);

    return {
      provider,
      nightlyPrice,
      totalPrice,
      rating: Math.round(rating * 10) / 10,
      reviews,
      availability,
      cancellation,
      cleaningFee,
      serviceFee,
      taxesFee,
      currency,
      perks: PROVIDER_PERKS[provider],
      score: 0,
    } as BookingOffer;
  });

  const priceValues = offers.map(o => o.nightlyPrice);
  const minPrice = Math.min(...priceValues);
  const maxPrice = Math.max(...priceValues);

  return offers.map(offer => {
    const priceScore = maxPrice === minPrice ? 1 : 1 - (offer.nightlyPrice - minPrice) / (maxPrice - minPrice);
    const ratingScore = offer.rating / 5;
    const cancellationScore = offer.cancellation === 'Flexible' ? 1 : offer.cancellation === 'Moderate' ? 0.7 : 0.4;
    const availabilityScore = offer.availability === 'Available' ? 1 : offer.availability === 'Limited' ? 0.6 : 0.2;
    const score = 0.4 * ratingScore + 0.35 * priceScore + 0.15 * cancellationScore + 0.1 * availabilityScore;

    return {
      ...offer,
      score: Math.round(score * 100) / 100,
    };
  });
};

export const rankBookingOffers = (offers: BookingOffer[]) => {
  return [...offers].sort((a, b) => b.score - a.score);
};

export const getOfferHighlights = (offers: BookingOffer[]) => {
  if (offers.length === 0) return { bestValue: null, bestRating: null, mostFlexible: null };
  const bestValue = [...offers].sort((a, b) => a.totalPrice - b.totalPrice)[0];
  const bestRating = [...offers].sort((a, b) => b.rating - a.rating)[0];
  const mostFlexible = offers.find(o => o.cancellation === 'Flexible') || bestValue;
  return { bestValue, bestRating, mostFlexible };
};
