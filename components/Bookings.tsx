import React, { useState } from 'react';
import { getBookings } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { ViewState } from '../types';

interface BookingsProps {
  onChangeView?: (view: ViewState) => void;
}

export const Bookings: React.FC<BookingsProps> = ({ onChangeView }) => {
  const { language, t } = useLanguage();
  const bookings = getBookings(language);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  // Simple filtering based on hardcoded status/ids for demo purposes since we lack real date objects
  // In a real app, compare dates. Here we assume 'Confirmed' is upcoming.
  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'upcoming') return b.status === 'Confirmed' || b.status === 'Pending';
    // We don't have explicit past bookings in mock data, so let's simulate one if 'past' is selected or just show empty state
    return false; 
  });

  const handleTicketClick = (bookingId: string) => {
    setSelectedTicket(bookingId);
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background-dark text-gray-200 pb-24 overflow-y-auto">
      <header className="flex items-center justify-between px-6 py-5 sticky top-0 z-20 bg-background-dark/95 backdrop-blur-md pt-12">
        <h1 className="text-2xl font-serif font-medium text-white">{t('my_bookings')}</h1>
        <button className="bg-charcoal-dark/50 backdrop-blur-md text-primary border border-primary/30 w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary hover:text-navy-dark transition-all shadow-glow relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </header>

      <div className="px-6 pb-6">
        <div className="flex p-1 bg-charcoal-card border border-white/5 rounded-xl relative">
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
            <div key={booking.id} className="group relative flex flex-col bg-charcoal-card border border-white/5 rounded-[20px] shadow-xl shadow-black/50 overflow-hidden transition-all hover:border-primary/30">
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
                    <h3 className="text-lg font-serif font-medium leading-tight mb-1 text-white">{booking.title}</h3>
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <span className="material-symbols-outlined text-[16px] text-primary">calendar_month</span> <span>{booking.date}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                      <span className="material-symbols-outlined text-[16px] text-primary">schedule</span> <span>{booking.time}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('guests')}</span>
                    <span className="font-bold text-white">{booking.guests}</span>
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
             <p className="text-gray-500 font-medium">No bookings found</p>
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
               <h2 className="text-xl font-bold text-white mb-1">E-Ticket</h2>
               <p className="text-white/80 text-sm">Scan at entrance</p>
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
                  <p className="text-sm text-gray-400">Booking ID</p>
                </div>
             </div>
             <button className="w-full bg-gray-50 py-4 font-bold text-primary text-sm uppercase tracking-wider hover:bg-gray-100">Download PDF</button>
          </div>
        </div>
      )}
    </div>
  );
};
