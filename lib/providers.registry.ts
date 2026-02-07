import { ProviderAdapter, createStubAdapter } from './providers';

export const providerRegistry: ProviderAdapter[] = [
  createStubAdapter('Airbnb', 'airbnb'),
  createStubAdapter('Booking.com', 'booking'),
  createStubAdapter('Aggregator', 'aggregator'),
];

export const getEnabledProviders = () => providerRegistry.filter(p => p.isEnabled);
