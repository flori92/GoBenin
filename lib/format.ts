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

export const formatDateISO = (dateISO: string, language: Language) => {
  const locale = language === 'fr' ? 'fr-FR' : 'en-US';
  const [year, month, day] = dateISO.split('-').map(Number);
  if (!year || !month || !day) return dateISO;
  return new Date(year, month - 1, day).toLocaleDateString(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatTime24 = (time24: string, language: Language) => {
  const locale = language === 'fr' ? 'fr-FR' : 'en-US';
  const [hours, minutes] = time24.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return time24;
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
};
