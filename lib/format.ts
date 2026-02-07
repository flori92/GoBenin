import { Language } from '../contexts/LanguageContext';
import { Location } from '../types';

export const formatCurrency = (amount: number, currency: 'XOF' | 'USD', language: Language) => {
  const locale = language === 'fr' ? 'fr-FR' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getLocationPriceLabel = (location: Location, language: Language) => {
  if (location.priceLabel) return location.priceLabel;
  if (location.priceAmount && location.priceCurrency) {
    return formatCurrency(location.priceAmount, location.priceCurrency, language);
  }
  if (location.priceAmount) {
    return formatCurrency(location.priceAmount, 'USD', language);
  }
  return null;
};
