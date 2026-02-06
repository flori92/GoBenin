import React from 'react';
import { getTours } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

export const Tours: React.FC = () => {
  const { language, t } = useLanguage();
  const tours = getTours(language);

  return (
    <div className="flex flex-col h-full bg-background-dark text-gray-200">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-background-dark/95 backdrop-blur-md pb-2 pt-8">
        <div className="flex items-center justify-between px-5 pt-2 pb-4">
          <h1 className="text-2xl font-serif font-medium text-white">{t('discover_circuits')}</h1>
          <button className="group flex h-10 w-10 items-center justify-center rounded-full bg-charcoal-card border border-white/10 shadow-lg transition-all active:scale-95 hover:border-primary/50">
            <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">tune</span>
          </button>
        </div>
        
        {/* Search */}
        <div className="px-5 pb-4">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-primary/80">search</span>
            <input className="h-12 w-full rounded-xl border border-primary/20 bg-charcoal-card/90 backdrop-blur-xl pl-12 pr-4 text-base font-medium shadow-lg ring-1 ring-white/5 placeholder:text-gray-500 focus:ring-2 focus:ring-primary text-white" placeholder={t('search_tours')} type="text"/>
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex w-full overflow-x-auto px-5 pb-2 no-scrollbar gap-3">
          <button className="flex h-9 shrink-0 items-center gap-2 rounded-full bg-primary px-4 text-sm font-bold text-navy-dark shadow-glow border border-primary">
            <span className="material-symbols-outlined text-[18px]">temple_buddhist</span> {t('all')}
          </button>
          <button className="flex h-9 shrink-0 items-center gap-2 rounded-full bg-transparent border border-white/10 px-4 text-sm font-medium text-gray-400 hover:text-primary hover:border-primary/50 transition-colors">
            <span className="material-symbols-outlined text-[18px]">history_edu</span> {t('history')}
          </button>
          <button className="flex h-9 shrink-0 items-center gap-2 rounded-full bg-transparent border border-white/10 px-4 text-sm font-medium text-gray-400 hover:text-primary hover:border-primary/50 transition-colors">
            <span className="material-symbols-outlined text-[18px]">forest</span> {t('nature')}
          </button>
          <button className="flex h-9 shrink-0 items-center gap-2 rounded-full bg-transparent border border-white/10 px-4 text-sm font-medium text-gray-400 hover:text-primary hover:border-primary/50 transition-colors">
            <span className="material-symbols-outlined text-[18px]">visibility</span> {t('voodoo')}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-6 px-5 pb-24 pt-2 overflow-y-auto no-scrollbar">
        {tours.map(tour => (
          <div key={tour.id} className="group relative flex flex-col overflow-hidden rounded-[20px] bg-charcoal-card border border-white/5 shadow-xl shadow-black/50 transition-all hover:shadow-gold hover:border-primary/30">
            {/* Image */}
            <div className="relative h-56 w-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark via-charcoal-dark/20 to-transparent z-10"></div>
              <div className="absolute top-3 left-3 z-20 rounded-lg bg-primary/90 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-navy-dark backdrop-blur-sm">
                {t(tour.tags[0].toLowerCase()) || tour.tags[0]}
              </div>
              <button className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-charcoal-dark/40 backdrop-blur-md text-white border border-white/10 transition-all hover:bg-primary hover:text-navy-dark hover:border-primary">
                <span className="material-symbols-outlined text-[20px]">favorite</span>
              </button>
              <div className="h-full w-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: `url('${tour.image}')` }}></div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-serif font-medium leading-tight text-white">{tour.name}</h2>
                  <p className="text-sm text-gray-400">{tour.location}</p>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/20 px-2 py-1">
                  <span className="material-symbols-outlined text-sm text-primary fill-1">star</span>
                  <span className="text-sm font-bold text-primary-light">{tour.rating}</span>
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-primary">schedule</span> {tour.duration}</div>
                <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-primary">hiking</span> {tour.distance}</div>
                <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-primary">pin_drop</span> {tour.stops} {t('stops')}</div>
              </div>

              <p className="text-sm leading-relaxed text-gray-300">{tour.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {tour.stopNames.map((stop, i) => (
                   <span key={i} className="inline-flex items-center rounded-md bg-charcoal-light/50 border border-white/5 px-2 py-1 text-xs font-medium text-gray-300">{stop}</span>
                ))}
              </div>

              <div className="mt-2 h-px w-full bg-white/5"></div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button className="flex items-center gap-1 text-sm font-semibold text-gray-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[18px]">map</span> {t('view_on_map')}
                </button>
                <button className="flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-navy-dark shadow-glow transition-transform active:scale-95 hover:bg-primary-light">
                  {t('book_for')} ${tour.price}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
