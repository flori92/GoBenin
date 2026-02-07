import React from 'react';
import { Tour } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { formatCurrency } from '../lib/format';

interface TourDetailsProps {
  tour: Tour;
  onBack: () => void;
  onBook: () => void;
  onViewOnMap?: () => void;
}

export const TourDetails: React.FC<TourDetailsProps> = ({ tour, onBack, onBook, onViewOnMap }) => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen pb-24 relative z-50 transition-colors duration-300 ${theme === 'dark' ? 'bg-background-dark' : 'bg-gray-50'}`}>
      {/* Hero Image */}
      <div className="relative h-72 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background-dark z-10"></div>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${tour.image}')` }}></div>
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="absolute top-14 left-4 z-20 flex items-center gap-2 px-3 py-2 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="text-sm font-medium">{t('back')}</span>
        </button>

        {/* Tag */}
        <div className="absolute bottom-4 left-4 z-20 rounded-lg bg-primary/90 px-3 py-1.5 text-sm font-bold uppercase tracking-wider text-navy-dark backdrop-blur-sm">
          {t(tour.tags[0].toLowerCase()) || tour.tags[0]}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-6 -mt-8 relative z-20">
        {/* Title & Rating */}
        <div className={`rounded-2xl p-5 shadow-lg ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className={`text-2xl font-serif font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{tour.name}</h1>
              <div className="flex items-center gap-1.5 mt-2 text-gray-400">
                <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                <span className="text-sm">{tour.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5">
              <span className="material-symbols-outlined text-primary fill-1">star</span>
              <span className="font-bold text-primary-light">{tour.rating}</span>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-primary">schedule</span>
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{tour.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-primary">hiking</span>
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{tour.distance}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-primary">pin_drop</span>
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{tour.stops} {t('stops')}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className={`rounded-2xl p-5 mt-4 shadow-lg ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`}>
          <h2 className={`text-lg font-serif font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('about_tour')}</h2>
          <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{tour.description}</p>
        </div>

        {/* Itinerary */}
        <div className={`rounded-2xl p-5 mt-4 shadow-lg ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`}>
          <h2 className={`text-lg font-serif font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('itinerary')}</h2>
          <div className="space-y-4">
            {tour.stopNames.map((stop, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  {index < tour.stopNames.length - 1 && (
                    <div className="w-0.5 h-8 bg-primary/20 mt-1"></div>
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{stop}</h3>
                  <p className="text-xs text-gray-400 mt-1">{t('stop')} {index + 1} / {tour.stops}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What's Included */}
        <div className={`rounded-2xl p-5 mt-4 shadow-lg ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`}>
          <h2 className={`text-lg font-serif font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('whats_included')}</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: 'directions_walk', label: t('guided_tour') },
              { icon: 'photo_camera', label: t('photo_ops') },
              { icon: 'local_drink', label: t('refreshments') },
              { icon: 'headphones', label: t('audio_guide') },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-2 p-3 rounded-xl ${theme === 'dark' ? 'bg-charcoal-light/30' : 'bg-gray-50'}`}>
                <span className="material-symbols-outlined text-primary">{item.icon}</span>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* View on Map Button */}
        {onViewOnMap && (
          <button 
            onClick={onViewOnMap}
            className={`w-full mt-4 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-colors ${theme === 'dark' ? 'bg-charcoal-light/50 text-white hover:bg-charcoal-light' : 'bg-gray-100 text-slate-900 hover:bg-gray-200'}`}
          >
            <span className="material-symbols-outlined">map</span>
            {t('view_on_map')}
          </button>
        )}
      </div>

      {/* Sticky Bottom CTA */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 z-30 backdrop-blur-xl border-t ${theme === 'dark' ? 'bg-charcoal-dark/95 border-white/10' : 'bg-white/95 border-gray-200'}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">{t('price_per_person')}</span>
            <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(tour.price, 'USD', language)}</span>
          </div>
          <button 
            onClick={onBook}
            className="flex-1 max-w-[200px] py-3 bg-primary text-navy-dark rounded-xl font-bold shadow-glow hover:bg-primary-light transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">calendar_month</span>
            {t('book_now')}
          </button>
        </div>
      </div>
    </div>
  );
};
