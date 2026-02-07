import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Tour, Location } from '../types';
import { formatCurrency, getLocationPriceLabel } from '../lib/format';

interface BookingModalProps {
  item: Tour | Location | null;
  onClose: () => void;
  onConfirm: (booking: BookingData) => void;
}

export interface BookingData {
  itemId: string;
  itemName: string;
  dateISO: string;
  time24: string;
  guests: number;
  guestsLabel: string;
  totalPrice: number;
  image: string;
}

const AVAILABLE_TIMES = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

export const BookingModal: React.FC<BookingModalProps> = ({ item, onClose, onConfirm }) => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guests, setGuests] = useState(1);
  const [step, setStep] = useState<'date' | 'time' | 'confirm'>('date');

  if (!item) return null;

  const parsePriceFromLabel = (value?: string) => {
    if (!value) return null;
    const digitsOnly = value.replace(/[^\d]/g, '');
    return digitsOnly ? parseInt(digitsOnly, 10) : null;
  };

  const isTour = 'price' in item;
  const locationPriceAmount = !isTour ? item.priceAmount : null;
  const locationCurrency = !isTour ? item.priceCurrency : null;
  const locationLabel = !isTour ? getLocationPriceLabel(item, language) : null;
  const fallbackAmount = locationLabel ? parsePriceFromLabel(locationLabel) : null;
  const price = isTour ? item.price : (locationPriceAmount ?? fallbackAmount ?? 45);
  const currency: 'XOF' | 'USD' | null = isTour ? 'USD' : (locationCurrency ?? null);
  const totalPrice = price * guests;
  const totalLabel = currency ? formatCurrency(totalPrice, currency, language) : `$${totalPrice}`;

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    return { daysInMonth, startingDay };
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dateLocale = language === 'fr' ? 'fr-FR' : 'en-US';
  const monthNames = Array.from({ length: 12 }, (_, i) => 
    new Date(2020, i, 1).toLocaleDateString(dateLocale, { month: 'long' })
  );
  const dayNames = Array.from({ length: 7 }, (_, i) => 
    new Date(2020, 0, 5 + i).toLocaleDateString(dateLocale, { weekday: 'short' })
  );

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date < today;
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === day && 
           selectedDate.getMonth() === currentMonth.getMonth() &&
           selectedDate.getFullYear() === currentMonth.getFullYear();
  };

  const handleDateSelect = (day: number) => {
    if (!isDateDisabled(day)) {
      setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
      setStep('time');
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('confirm');
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onConfirm({
        itemId: item.id,
        itemName: item.name,
        dateISO: selectedDate.toISOString().slice(0, 10),
        time24: selectedTime,
        guests,
        guestsLabel: t('guests_people', { count: guests }),
        totalPrice,
        image: item.image,
      });
    }
  };

  const renderCalendar = () => (
    <div className="flex flex-col">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-charcoal-light text-gray-400 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <h3 className={`text-lg font-serif ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button 
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-charcoal-light text-gray-400 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startingDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const disabled = isDateDisabled(day);
          const selected = isDateSelected(day);
          return (
            <button
              key={day}
              onClick={() => handleDateSelect(day)}
              disabled={disabled}
              className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                selected 
                  ? 'bg-primary text-navy-dark font-bold shadow-glow' 
                  : disabled 
                    ? 'text-gray-600 cursor-not-allowed' 
                    : 'text-white hover:bg-charcoal-light'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderTimeSelection = () => (
    <div className="flex flex-col">
      <button 
        onClick={() => setStep('date')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 self-start"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        {t('edit_date')}
      </button>
      
      <div className="bg-charcoal-light/50 rounded-xl p-3 mb-4 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">calendar_month</span>
        <span className="text-white font-medium">
          {selectedDate?.toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'long' })}
        </span>
      </div>

      <h4 className="text-sm text-gray-400 mb-3">{t('choose_time')}</h4>
      <div className="grid grid-cols-3 gap-3">
        {AVAILABLE_TIMES.map(time => (
          <button
            key={time}
            onClick={() => handleTimeSelect(time)}
            className={`py-3 rounded-xl text-sm font-medium transition-all ${
              selectedTime === time 
                ? 'bg-primary text-navy-dark font-bold' 
                : 'bg-charcoal-light border border-white/10 text-white hover:border-primary/50'
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="flex flex-col">
      <button 
        onClick={() => setStep('time')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 self-start"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        {t('edit_time')}
      </button>

      {/* Summary */}
      <div className="bg-charcoal-light/30 rounded-2xl p-4 mb-4 border border-white/5">
        <div className="flex gap-4">
          <div className="w-20 h-20 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url('${item.image}')` }}></div>
          <div className="flex-1">
            <h4 className="font-serif text-white font-medium">{item.name}</h4>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
              <span className="material-symbols-outlined text-primary text-[16px]">calendar_month</span>
              {selectedDate?.toLocaleDateString(dateLocale, { day: 'numeric', month: 'short' })}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="material-symbols-outlined text-primary text-[16px]">schedule</span>
              {selectedTime}
            </div>
          </div>
        </div>
      </div>

      {/* Guests */}
      <div className="flex items-center justify-between bg-charcoal-light/30 rounded-xl p-4 mb-4 border border-white/5">
        <span className="text-white">{t('guests_count')}</span>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setGuests(g => Math.max(1, g - 1))}
            className="w-8 h-8 rounded-full bg-charcoal-card border border-white/10 text-white flex items-center justify-center hover:border-primary/50"
          >
            <span className="material-symbols-outlined text-[18px]">remove</span>
          </button>
          <span className="text-white font-bold w-8 text-center">{guests}</span>
          <button 
            onClick={() => setGuests(g => Math.min(10, g + 1))}
            className="w-8 h-8 rounded-full bg-charcoal-card border border-white/10 text-white flex items-center justify-center hover:border-primary/50"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-gray-400">{t('total')}</span>
        <span className="text-2xl font-bold text-primary">{totalLabel}</span>
      </div>

      <button 
        onClick={handleConfirm}
        className="w-full bg-primary text-navy-dark font-bold py-4 rounded-xl shadow-glow active:scale-95 transition-transform"
      >
        {t('confirm_booking')}
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div 
        className={`w-full max-w-lg rounded-t-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto animate-slide-up ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-serif ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {step === 'date' && t('select_date')}
            {step === 'time' && t('select_time')}
            {step === 'confirm' && t('confirm')}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-6">
          {['date', 'time', 'confirm'].map((s, i) => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === s ? 'bg-primary text-navy-dark' : 
                ['date', 'time', 'confirm'].indexOf(step) > i ? 'bg-primary/30 text-primary' : 
                'bg-charcoal-light text-gray-500'
              }`}>
                {i + 1}
              </div>
              {i < 2 && <div className={`flex-1 h-0.5 ${['date', 'time', 'confirm'].indexOf(step) > i ? 'bg-primary/50' : 'bg-charcoal-light'}`}></div>}
            </React.Fragment>
          ))}
        </div>

        {/* Content */}
        {step === 'date' && renderCalendar()}
        {step === 'time' && renderTimeSelection()}
        {step === 'confirm' && renderConfirmation()}
      </div>
    </div>
  );
};
