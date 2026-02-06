import React, { useState, useMemo } from 'react';
import { getTours } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Tour } from '../types';

interface ToursProps {
  onBookTour?: (tour: Tour) => void;
  onViewOnMap?: (tour: Tour) => void;
}

export const Tours: React.FC<ToursProps> = ({ onBookTour, onViewOnMap }) => {
  const { language, t } = useLanguage();
  const { theme } = useTheme();
  const allTours = getTours(language);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'duration'>('rating');

  const filters = [
    { id: 'all', label: t('all'), icon: 'temple_buddhist' },
    { id: 'heritage', label: t('history'), icon: 'history_edu' },
    { id: 'nature', label: t('nature'), icon: 'forest' },
    { id: 'cultural', label: t('voodoo'), icon: 'visibility' },
  ];

  const filteredTours = useMemo(() => {
    let result = allTours;
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(tour => 
        tour.name.toLowerCase().includes(query) ||
        tour.location.toLowerCase().includes(query) ||
        tour.description.toLowerCase().includes(query) ||
        tour.stopNames.some(stop => stop.toLowerCase().includes(query))
      );
    }
    
    // Filter by category
    if (activeFilter !== 'all') {
      result = result.filter(tour => 
        tour.tags.some(tag => tag.toLowerCase() === activeFilter)
      );
    }
    
    // Filter by price range
    result = result.filter(tour => tour.price >= priceRange[0] && tour.price <= priceRange[1]);
    
    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') return a.price - b.price;
      return 0;
    });
    
    return result;
  }, [allTours, searchQuery, activeFilter, priceRange, sortBy]);

  const toggleFavorite = (tourId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(tourId)) {
        newFavorites.delete(tourId);
      } else {
        newFavorites.add(tourId);
      }
      return newFavorites;
    });
  };

  return (
    <div className={`flex flex-col h-full transition-colors duration-300 ${theme === 'dark' ? 'bg-background-dark text-gray-200' : 'bg-gray-50 text-slate-800'}`}>
      {/* Sticky Header */}
      <div className={`sticky top-0 z-20 backdrop-blur-md pb-2 pt-8 ${theme === 'dark' ? 'bg-background-dark/95' : 'bg-gray-50/95'}`}>
        <div className="flex items-center justify-between px-5 pt-2 pb-4">
          <h1 className="text-2xl font-serif font-medium text-white">{t('discover_circuits')}</h1>
          <button 
            onClick={() => setShowFiltersModal(true)}
            className="group flex h-10 w-10 items-center justify-center rounded-full bg-charcoal-card border border-white/10 shadow-lg transition-all active:scale-95 hover:border-primary/50"
          >
            <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">tune</span>
          </button>
        </div>
        
        {/* Search */}
        <div className="px-5 pb-4">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-primary/80">search</span>
            <input 
              className="h-12 w-full rounded-xl border border-primary/20 bg-charcoal-card/90 backdrop-blur-xl pl-12 pr-4 text-base font-medium shadow-lg ring-1 ring-white/5 placeholder:text-gray-500 focus:ring-2 focus:ring-primary text-white" 
              placeholder={t('search_tours')} 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-gray-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex w-full overflow-x-auto px-5 pb-2 no-scrollbar gap-3">
          {filters.map(filter => (
            <button 
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all ${
                activeFilter === filter.id 
                  ? 'bg-primary text-navy-dark font-bold shadow-glow border border-primary' 
                  : 'bg-transparent border border-white/10 text-gray-400 hover:text-primary hover:border-primary/50'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{filter.icon}</span> {filter.label}
            </button>
          ))}
        </div>
        
        {/* Results count */}
        <div className="px-5 py-2 text-xs text-gray-500">
          {filteredTours.length} {filteredTours.length === 1 ? 'circuit' : 'circuits'} {t('found') || 'trouvé(s)'}
        </div>
      </div>

      {/* Filters Modal */}
      {showFiltersModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowFiltersModal(false)}>
          <div className="w-full max-w-md bg-charcoal-card rounded-t-3xl p-6 pb-10 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif text-white">Filtres avancés</h3>
              <button onClick={() => setShowFiltersModal(false)} className="text-gray-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            {/* Price Range */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-3 block">Prix (${priceRange[0]} - ${priceRange[1]})</label>
              <input 
                type="range" 
                min="0" 
                max="200" 
                value={priceRange[1]} 
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full accent-primary"
              />
            </div>
            
            {/* Sort By */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-3 block">Trier par</label>
              <div className="flex gap-2">
                {[
                  { id: 'rating', label: 'Note', icon: 'star' },
                  { id: 'price', label: 'Prix', icon: 'payments' },
                ].map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id as any)}
                    className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                      sortBy === option.id 
                        ? 'bg-primary text-navy-dark font-bold' 
                        : 'bg-charcoal-light border border-white/10 text-gray-400'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{option.icon}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => setShowFiltersModal(false)}
              className="w-full bg-primary text-navy-dark font-bold py-3 rounded-xl shadow-glow"
            >
              Appliquer les filtres
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="flex flex-col gap-6 px-5 pb-24 pt-2 overflow-y-auto no-scrollbar">
        {filteredTours.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="material-symbols-outlined text-6xl text-primary/30 mb-4">search_off</span>
            <p className="text-gray-400 font-medium">Aucun circuit trouvé</p>
            <p className="text-gray-500 text-sm mt-1">Essayez de modifier vos filtres</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveFilter('all'); setPriceRange([0, 200]); }}
              className="mt-4 text-primary font-semibold hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          filteredTours.map(tour => (
            <div key={tour.id} className="group relative flex flex-col overflow-hidden rounded-[20px] bg-charcoal-card border border-white/5 shadow-xl shadow-black/50 transition-all hover:shadow-gold hover:border-primary/30">
              {/* Image */}
              <div className="relative h-56 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark via-charcoal-dark/20 to-transparent z-10"></div>
                <div className="absolute top-3 left-3 z-20 rounded-lg bg-primary/90 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-navy-dark backdrop-blur-sm">
                  {t(tour.tags[0].toLowerCase()) || tour.tags[0]}
                </div>
                <button 
                  onClick={() => toggleFavorite(tour.id)}
                  className={`absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md border transition-all ${
                    favorites.has(tour.id) 
                      ? 'bg-primary text-navy-dark border-primary' 
                      : 'bg-charcoal-dark/40 text-white border-white/10 hover:bg-primary hover:text-navy-dark hover:border-primary'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${favorites.has(tour.id) ? 'fill-1' : ''}`}>favorite</span>
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
                  <button 
                    onClick={() => onViewOnMap?.(tour)}
                    className="flex items-center gap-1 text-sm font-semibold text-gray-400 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">map</span> {t('view_on_map')}
                  </button>
                  <button 
                    onClick={() => onBookTour?.(tour)}
                    className="flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-navy-dark shadow-glow transition-transform active:scale-95 hover:bg-primary-light"
                  >
                    {t('book_for')} ${tour.price}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
