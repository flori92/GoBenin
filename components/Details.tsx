import React from 'react';
import { Location } from '../types';
import { IMAGES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface DetailsProps {
  location: Location;
  onBack: () => void;
  onBook?: () => void;
}

export const Details: React.FC<DetailsProps> = ({ location, onBack, onBook }) => {
  const images = location.images || [];
  const { t } = useLanguage();

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen pb-24 relative z-50">
      {/* Header Actions */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 pt-12 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white pointer-events-auto hover:bg-white/30 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex gap-3 pointer-events-auto">
          <button className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors">
            <span className="material-symbols-outlined">ios_share</span>
          </button>
          <button className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors group">
            <span className="material-symbols-outlined group-hover:text-red-500 transition-colors">favorite</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[420px] w-full shrink-0">
        <div className="h-full w-full bg-gray-200 bg-cover bg-center" style={{ backgroundImage: `url('${location.image}')` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark via-transparent to-transparent"></div>
        </div>
        
        {/* Gallery Thumbnails Overlay */}
        {images.length > 0 && (
          <div className="absolute bottom-6 left-4 right-4 flex gap-3 overflow-x-auto no-scrollbar snap-x">
            {images.map((img, idx) => (
              <div key={idx} className={`h-16 w-24 shrink-0 rounded-lg border-2 ${idx === 0 ? 'border-primary' : 'border-white/50 grayscale hover:grayscale-0'} bg-cover bg-center shadow-lg transition-all`} style={{ backgroundImage: `url('${img}')` }}></div>
            ))}
            <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-sm border-2 border-white/30">
              <span className="text-xs font-bold">+5 more</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="relative -mt-4 flex flex-1 flex-col rounded-t-3xl bg-background-light dark:bg-background-dark px-5 pt-6">
        
        {/* Title Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">{location.name}</h1>
          <div className="flex items-center gap-1.5 mt-2 text-gray-500 dark:text-gray-400">
            <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
            <span className="text-sm font-medium">{location.subtitle}, Benin</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary-dark dark:text-primary">
              <span className="material-symbols-outlined text-[14px]">public</span> {t(location.category.toLowerCase()) || location.category}
            </span>
             {location.price && location.price.includes('CFA') && (
              <span className="inline-flex items-center rounded-full bg-white dark:bg-[#2c241b] border border-gray-200 dark:border-gray-700 px-3 py-1 text-xs font-medium text-slate-700 dark:text-gray-300">
                {t('ticketed')}
              </span>
             )}
          </div>
        </div>

        {/* Quick Info Grid - Only if data exists */}
        {location.hours && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-[#2c241b] p-3 shadow-sm border border-gray-100 dark:border-gray-800">
              <span className="material-symbols-outlined mb-1 text-primary">schedule</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400">{t('hours')}</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{location.hours}</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-[#2c241b] p-3 shadow-sm border border-gray-100 dark:border-gray-800">
              <span className="material-symbols-outlined mb-1 text-primary">timer</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400">{t('duration')}</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{location.duration}</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-[#2c241b] p-3 shadow-sm border border-gray-100 dark:border-gray-800">
              <span className="material-symbols-outlined mb-1 text-primary">payments</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400">{t('entry')}</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{location.price}</span>
            </div>
          </div>
        )}

        {/* Features for Hotels/Lodges */}
        {location.features && (
          <div className="mb-8">
             <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">{t('amenities')}</h3>
             <div className="grid grid-cols-4 gap-4">
               {location.features.map((f, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 rounded-xl bg-white dark:bg-[#2c241b] p-3 shadow-sm border border-black/5 dark:border-white/5">
                    <span className="material-symbols-outlined text-primary">{f.icon}</span>
                    <span className="text-[10px] font-medium text-slate-900 dark:text-white">{f.label}</span>
                  </div>
               ))}
             </div>
          </div>
        )}

        {/* About Section */}
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">{t('about_dest')}</h2>
          <div className="relative">
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{location.description}</p>
            <button className="mt-2 text-sm font-bold text-primary hover:underline">{t('read_more')}</button>
          </div>
        </div>

        {/* Reviews Snapshot */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('reviews')}</h2>
            <button className="text-sm font-semibold text-primary">{t('see_all')}</button>
          </div>
          <div className="rounded-2xl bg-white dark:bg-[#2c241b] p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-black text-slate-900 dark:text-white">{location.rating}</span>
                <div className="flex text-primary text-[14px]">
                  {[1,2,3,4,5].map(s => <span key={s} className="material-symbols-outlined fill-1">star</span>)}
                </div>
                <span className="text-xs text-gray-400 mt-1">{location.reviews} {t('reviews_count')}</span>
              </div>
              <div className="h-12 w-px bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <div className="size-8 rounded-full bg-gray-300 bg-cover bg-center" style={{ backgroundImage: `url('${IMAGES.user}')` }}></div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Sarah Jenkins</p>
                    <p className="text-[10px] text-gray-400">2 {t('weeks')} {t('ago')}</p>
                  </div>
                </div>
                <p className="text-xs italic text-gray-600 dark:text-gray-300 line-clamp-2">"An incredible walk through history. The guides are very knowledgeable about the Dahomey Amazon warriors. Highly recommend!"</p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Nearby Map */}
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">{t('location')}</h2>
          <div className="relative overflow-hidden rounded-2xl h-64 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 group cursor-pointer">
            <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: `url('${IMAGES.mapDetail}')` }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
              <div className="rounded-full bg-primary p-2 text-white ring-4 ring-white/30 shadow-xl">
                <span className="material-symbols-outlined text-[24px] fill-1">location_on</span>
              </div>
            </div>
             <div className="absolute bottom-4 left-4 right-4 z-10">
                <button className="w-full rounded-xl bg-white/90 dark:bg-[#2c241b]/90 backdrop-blur-md py-3 text-sm font-bold text-slate-900 dark:text-white shadow-lg">
                    {t('explore_map')}
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 w-full border-t border-white/10 bg-charcoal-dark/95 px-6 py-4 backdrop-blur-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">{t('price_per_person')}</span>
            <span className="text-xl font-bold text-white">{location.price || t('contact_price')}</span>
          </div>
          <button 
            onClick={onBook}
            className="flex-1 rounded-xl bg-primary px-6 py-3.5 text-center text-sm font-bold text-navy-dark shadow-glow transition-transform active:scale-95 hover:bg-primary-light"
          >
            {t('book_visit')}
          </button>
        </div>
      </div>
    </div>
  );
};
