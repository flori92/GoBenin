export type ProviderSource = 'airbnb' | 'booking' | 'aggregator';

export interface ProviderSearchParams {
  locationId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface ProviderOffer {
  provider: string;
  nightlyPrice: number;
  totalPrice: number;
  currency: 'XOF' | 'USD';
  availability: 'Available' | 'Limited' | 'Sold Out';
  cancellation: 'Flexible' | 'Moderate' | 'Strict';
  rating: number;
  reviews: number;
  perks: string[];
}

export interface ProviderAdapter {
  source: ProviderSource;
  name: string;
  isEnabled: boolean;
  search: (params: ProviderSearchParams) => Promise<ProviderOffer[]>;
}

export const createStubAdapter = (name: string, source: ProviderSource): ProviderAdapter => ({
  source,
  name,
  isEnabled: false,
  search: async () => {
    throw new Error(`${name} adapter not configured`);
  },
});
