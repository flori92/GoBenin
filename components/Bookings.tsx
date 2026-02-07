import React, { useState, useMemo } from 'react';
import { getBookings } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { ViewState, Booking } from '../types';
import { formatCurrency, formatDateISO, formatTime24 } from '../lib/format';
import { NotificationsPopover } from './NotificationsPopover';

interface BookingsProps {
  onChangeView?: (view: ViewState) => void;
  customBookings?: Booking[];
}

export const Bookings: React.FC<BookingsProps> = ({ onChangeView, customBookings = [] }) => {
  const { language, t } = useLanguage();
  const { theme } = useTheme();
  const defaultBookings = getBookings(language);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  // Combine custom bookings with default ones
  const allBookings = useMemo(() => {
    return [...customBookings, ...defaultBookings];
  }, [customBookings, defaultBookings]);

  const filteredBookings = useMemo(() => {
    return allBookings.filter(b => {
      if (activeTab === 'upcoming') return b.status === 'Confirmed' || b.status === 'Pending';
      return b.status === 'Past';
    });
  }, [allBookings, activeTab]);

  const getBookingDate = (booking: Booking) => {
    if (booking.dateLabel) return booking.dateLabel;
    if (booking.dateISO) return formatDateISO(booking.dateISO, language);
    return (booking as any).date || '';
  };

  const getBookingTime = (booking: Booking) => {
    if (booking.timeLabel) return booking.timeLabel;
    if (booking.time24) return formatTime24(booking.time24, language);
    return (booking as any).time || '';
  };

  const getBookingGuests = (booking: Booking) => {
    if (booking.guestsLabel) return booking.guestsLabel;
    if (typeof booking.guestsCount === 'number') return t('guests_people', { count: booking.guestsCount });
    return (booking as any).guests || '';
  };

  const getBookingProvider = (booking: Booking) => {
    return booking.provider || 'GoBenin';
  };

  const getBookingTotal = (booking: Booking) => {
    if (booking.totalPrice && booking.currency) {
      return formatCurrency(booking.totalPrice, booking.currency, language);
    }
    return null;
  };

  const handleTicketClick = (bookingId: string) => {
    setSelectedTicket(bookingId);
  }

  return (
    <div className={`flex-1 flex flex-col h-full pb-24 overflow-y-auto transition-colors duration-300 ${theme === 'dark' ? 'bg-background-dark text-gray-200' : 'bg-gray-50 text-slate-800'}`}>
      <header className={`flex items-center justify-between px-6 py-5 sticky top-0 z-20 backdrop-blur-md pt-12 ${theme === 'dark' ? 'bg-background-dark/95' : 'bg-gray-50/95'}`}>
        <h1 className={`text-2xl font-serif font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('my_bookings')}</h1>
        <NotificationsPopover onNavigate={(view) => onChangeView?.(view)} />
      </header>

      <div className="px-6 pb-6">
        <div className={`flex p-1 rounded-xl relative ${theme === 'dark' ? 'bg-charcoal-card border border-white/5' : 'bg-gray-100 border border-gray-200'}`}>
          {/* Animated background tab */}
          <div className={`w-1/2 h-full absolute top-1 bottom-1 bg-primary/20 border border-primary/30 rounded-lg z-0 transition-all duration-300 ${activeTab === 'upcoming' ? 'left-1' : 'left-[calc(50%-4px)] translate-x-1'}`}></div>
          
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 relative z-10 py-2.5 text-sm font-bold text-center transition-colors ${activeTab === 'upcoming' ? 'text-primary' : 'text-gray-500'}`}
          >
            {t('upcoming')}
          </button>
          <button 
            onClick={() => setActiveTab('past')}
            className={`flex-1 relative z-10 py-2.5 text-sm font-bold text-center transition-colors ${activeTab === 'past' ? 'text-primary' : 'text-gray-500'}`}
          >
            {t('past')}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 px-6 pb-6 min-h-[50vh]">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div key={booking.id} className={`group relative flex flex-col rounded-[20px] shadow-xl overflow-hidden transition-all hover:border-primary/30 ${theme === 'dark' ? 'bg-charcoal-card border border-white/5 shadow-black/50' : 'bg-white border border-gray-200 shadow-gray-300/50'}`}>
              <div className="h-40 w-full relative overflow-hidden">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${booking.image}')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark via-charcoal-dark/20 to-transparent"></div>
                <div className="absolute bottom-3 left-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full backdrop-blur-sm text-xs font-bold border ${booking.status === 'Confirmed' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-orange-500/20 text-orange-400 border-orange-500/30'}`}>
                    <span className="material-symbols-outlined text-[14px]">{booking.status === 'Confirmed' ? 'check_circle' : 'pending'}</span>
                    {booking.status === 'Confirmed' ? t('confirmed') : t('payment_pending')}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex flex-col gap-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-lg font-serif font-medium leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{booking.title}</h3>
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme === 'dark' ? 'border-white/10 text-gray-300' : 'border-gray-200 text-gray-600'}`}>
                        {getBookingProvider(booking)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <span className="material-symbols-outlined text-[16px] text-primary">calendar_month</span> <span>{getBookingDate(booking)}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                      <span className="material-symbols-outlined text-[16px] text-primary">schedule</span> <span>{getBookingTime(booking)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('guests')}</span>
                    <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{getBookingGuests(booking)}</span>
                    {getBookingTotal(booking) && (
                      <span className="text-xs text-primary font-semibold mt-1">{getBookingTotal(booking)}</span>
                    )}
                  </div>
                </div>
                <hr className="border-dashed border-white/10 my-1"/>
                <div className="flex gap-3">
                  {booking.status === 'Confirmed' ? (
                    <button 
                      onClick={() => handleTicketClick(booking.id)}
                      className="flex-1 bg-primary hover:bg-primary-light text-navy-dark font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-glow"
                    >
                        <span className="material-symbols-outlined text-[20px]">qr_code_2</span> {t('view_ticket')}
                    </button>
                  ) : (
                      <button className="flex-1 bg-transparent border-2 border-primary text-primary font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors">
                        {t('complete_payment')}
                      </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 opacity-60">
             <span className="material-symbols-outlined text-6xl text-primary/30 mb-2">history_edu</span>
             <p className="text-gray-500 font-medium">{t('no_bookings')}</p>
          </div>
        )}
        
        <div className="mt-4 p-6 rounded-2xl bg-charcoal-card/50 border border-dashed border-primary/30 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary mb-1">
                <span className="material-symbols-outlined">explore</span>
            </div>
            <h4 className="text-base font-serif font-medium text-white">{t('looking_for_more')}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('discover_new')}</p>
            <button 
              onClick={() => onChangeView && onChangeView('TOURS')}
              className="text-primary font-bold text-sm hover:underline"
            >
              {t('explore_circuits')}
            </button>
        </div>
      </div>

      {/* Ticket Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6" onClick={() => setSelectedTicket(null)}>
          <div className="bg-white rounded-3xl overflow-hidden w-full max-w-sm relative" onClick={e => e.stopPropagation()}>
             <div className="bg-primary p-6 text-center relative">
               <h2 className="text-xl font-bold text-white mb-1">{t('e_ticket')}</h2>
               <p className="text-white/80 text-sm">{t('scan_at_entrance')}</p>
               <button onClick={() => setSelectedTicket(null)} className="absolute top-4 right-4 text-white/80 hover:text-white">
                  <span className="material-symbols-outlined">close</span>
               </button>
             </div>
             <div className="p-8 flex flex-col items-center gap-4 relative">
                <div className="absolute -top-3 left-0 w-full flex justify-between px-[-10px]">
                   <div className="w-6 h-6 rounded-full bg-black/80 -ml-3"></div>
                   <div className="w-6 h-6 rounded-full bg-black/80 -mr-3"></div>
                </div>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-2">
                   <span className="material-symbols-outlined text-[150px] text-slate-900">qr_code_2</span>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg text-slate-900">#BK-8392-BEN</p>
                  <p className="text-sm text-gray-400">{t('booking_id')}</p>
                </div>
             </div>
             <button className="w-full bg-gray-50 py-4 font-bold text-primary text-sm uppercase tracking-wider hover:bg-gray-100">{t('download_pdf')}</button>
          </div>
        </div>
      )}
    </div>
  );
};
