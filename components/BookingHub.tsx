import React, { useMemo, useState, useEffect } from 'react';
import { Location, BookingProvider } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';
import { formatCurrency } from '../lib/format';
import {
  BookingOffer,
  BookingSearchParams,
  generateBookingOffers,
  getOfferHighlights,
  getStayNights,
  rankBookingOffers,
} from '../lib/booking';

export interface SmartBookingData {
  provider: BookingProvider;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  currency: 'XOF' | 'USD';
  locationName: string;
  image: string;
}

interface BookingHubProps {
  location: Location;
  onSmartBook?: (data: SmartBookingData) => void;
}

const getDefaultDates = () => {
  const today = new Date();
  const checkIn = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
  const checkOut = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10);
  return {
    checkIn: checkIn.toISOString().slice(0, 10),
    checkOut: checkOut.toISOString().slice(0, 10),
  };
};

const getAvailabilityBadge = (value: string) => {
  if (value === 'Available') return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  if (value === 'Limited') return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
  return 'bg-red-500/15 text-red-400 border-red-500/30';
};

export const BookingHub: React.FC<BookingHubProps> = ({ location, onSmartBook }) => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const { notify } = useNotifications();
  const defaults = useMemo(() => getDefaultDates(), []);
  const [checkIn, setCheckIn] = useState(defaults.checkIn);
  const [checkOut, setCheckOut] = useState(defaults.checkOut);
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    if (outDate <= inDate) {
      const next = new Date(inDate.getFullYear(), inDate.getMonth(), inDate.getDate() + 1);
      setCheckOut(next.toISOString().slice(0, 10));
    }
  }, [checkIn, checkOut]);

  const params: BookingSearchParams = { checkIn, checkOut, guests };
  const offers = useMemo(() => generateBookingOffers(location, params), [location, checkIn, checkOut, guests]);
  const ranked = useMemo(() => rankBookingOffers(offers), [offers]);
  const highlights = useMemo(() => getOfferHighlights(offers), [offers]);
  const nights = getStayNights(checkIn, checkOut);

  const handleReserve = (offer: BookingOffer) => {
    onSmartBook?.({
      provider: offer.provider,
      checkIn,
      checkOut,
      guests,
      totalPrice: offer.totalPrice,
      currency: offer.currency,
      locationName: location.name,
      image: location.image,
    });
  };

  const handlePriceAlert = () => {
    notify({
      title: t('price_alert_set'),
      message: t('notification_price_alert_desc'),
      type: 'price',
    });
  };

  const renderOfferCard = (offer: BookingOffer, isBest: boolean) => {
    const totalLabel = formatCurrency(offer.totalPrice, offer.currency, language);
    const nightlyLabel = formatCurrency(offer.nightlyPrice, offer.currency, language);

    return (
      <div
        key={offer.provider}
        className={`rounded-2xl p-4 border transition-all ${
          isBest
            ? theme === 'dark'
              ? 'bg-primary/5 border-primary/40 shadow-glow'
              : 'bg-primary/10 border-primary/40 shadow-primary/30'
            : theme === 'dark'
              ? 'bg-[#2c241b] border-white/5'
              : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h4 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{offer.provider}</h4>
              {isBest && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-primary/20 text-primary border border-primary/40">
                  {t('best_match')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
              <span className="material-symbols-outlined text-[16px] text-primary">star</span>
              <span>{offer.rating} ({offer.reviews})</span>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{nightlyLabel}</p>
            <p className="text-xs text-gray-400">{t('per_night')}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${getAvailabilityBadge(offer.availability)}`}>
            <span className="material-symbols-outlined text-[14px]">inventory_2</span>
            {t(offer.availability === 'Available' ? 'available' : offer.availability === 'Limited' ? 'limited' : 'sold_out')}
          </span>
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
            theme === 'dark' ? 'bg-white/5 text-gray-300 border-white/10' : 'bg-gray-100 text-gray-600 border-gray-200'
          }`}>
            <span className="material-symbols-outlined text-[14px]">policy</span>
            {t(offer.cancellation === 'Flexible' ? 'flexible' : offer.cancellation === 'Moderate' ? 'moderate' : 'strict')}
          </span>
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
            theme === 'dark' ? 'bg-white/5 text-gray-300 border-white/10' : 'bg-gray-100 text-gray-600 border-gray-200'
          }`}>
            <span className="material-symbols-outlined text-[14px]">insights</span>
            {t('value_score')}: {Math.round(offer.score * 100)}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-gray-400">
          <div className={`rounded-xl p-2 border ${theme === 'dark' ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
            <p className="uppercase tracking-wide">{t('cleaning_fee')}</p>
            <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {formatCurrency(offer.cleaningFee, offer.currency, language)}
            </p>
          </div>
          <div className={`rounded-xl p-2 border ${theme === 'dark' ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
            <p className="uppercase tracking-wide">{t('service_fee')}</p>
            <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {formatCurrency(offer.serviceFee, offer.currency, language)}
            </p>
          </div>
          <div className={`rounded-xl p-2 border ${theme === 'dark' ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
            <p className="uppercase tracking-wide">{t('taxes_fees')}</p>
            <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {formatCurrency(offer.taxesFee, offer.currency, language)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">{t('total_with_fees')}</p>
            <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{totalLabel}</p>
          </div>
          <button
            onClick={() => handleReserve(offer)}
            className={`bg-primary text-navy-dark font-bold px-4 py-2 rounded-xl shadow-glow hover:bg-primary-light transition-colors ${
              offer.availability === 'Sold Out' ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            disabled={offer.availability === 'Sold Out'}
          >
            {t('book_with')}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {offer.perks.map(perk => (
            <span
              key={perk}
              className={`text-[11px] px-2 py-1 rounded-full border ${
                theme === 'dark' ? 'border-white/10 text-gray-300' : 'border-gray-200 text-gray-500'
              }`}
            >
              {perk}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section id="smart-booking-hub" className="mb-10">
      <div className={`rounded-3xl p-6 border shadow-lg ${theme === 'dark' ? 'bg-charcoal-card border-white/10' : 'bg-white border-gray-100'}`}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('smart_booking_title')}</h3>
            <button
              onClick={handlePriceAlert}
              className="text-xs font-semibold text-primary border border-primary/40 px-3 py-1.5 rounded-full hover:bg-primary/10"
            >
              {t('price_alert')}
            </button>
          </div>
          <p className="text-sm text-gray-400">{t('smart_booking_subtitle')}</p>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className={`rounded-2xl border p-3 flex flex-col gap-2 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
            <label className="text-xs text-gray-400">{t('check_in')}</label>
            <input
              type="date"
              value={checkIn}
              onChange={(event) => setCheckIn(event.target.value)}
              className={`bg-transparent text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
            />
          </div>
          <div className={`rounded-2xl border p-3 flex flex-col gap-2 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
            <label className="text-xs text-gray-400">{t('check_out')}</label>
            <input
              type="date"
              value={checkOut}
              onChange={(event) => setCheckOut(event.target.value)}
              className={`bg-transparent text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
            />
          </div>
          <div className={`rounded-2xl border p-3 flex items-center justify-between ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
            <div>
              <p className="text-xs text-gray-400">{t('guests')}</p>
              <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('guests_people', { count: guests })}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                className="w-8 h-8 rounded-full border border-primary/40 text-primary hover:bg-primary/10"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <button
                onClick={() => setGuests(prev => Math.min(8, prev + 1))}
                className="w-8 h-8 rounded-full border border-primary/40 text-primary hover:bg-primary/10"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
          <span className="material-symbols-outlined text-[16px] text-primary">auto_awesome</span>
          {t('stay_dates')}: {t('nights', { count: nights })}
        </div>

        <div className="mt-6 grid gap-4">
          {ranked.map(offer => renderOfferCard(offer, ranked[0]?.provider === offer.provider))}
        </div>

        <div className={`mt-6 rounded-2xl p-4 border ${theme === 'dark' ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
          <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('smart_reco')}</p>
          <div className="flex flex-wrap gap-2 mt-2 text-xs">
            {highlights.bestValue && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {t('best_value')}: {highlights.bestValue.provider}
              </span>
            )}
            {highlights.bestRating && (
              <span className="px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                {t('highest_rated')}: {highlights.bestRating.provider}
              </span>
            )}
            {highlights.mostFlexible && (
              <span className="px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30">
                {t('free_cancellation')}: {highlights.mostFlexible.provider}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-3">{t('booking_powered')}</p>
        </div>
      </div>
    </section>
  );
};
