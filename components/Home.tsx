import React, { useState, useMemo } from 'react';
import { IMAGES, getFeaturedDestinations, getHeritageSites, getNearbyActivities } from '../constants';
import { Location } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface HomeProps {
  onSelectLocation: (location: Location) => void;
}

export const Home: React.FC<HomeProps> = ({ onSelectLocation }) => {
  const { language, setLanguage, t } = useLanguage();
  const featured = getFeaturedDestinations(language);
  const heritage = getHeritageSites(language);
  const nearby = getNearbyActivities(language);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [nearbyFilter, setNearbyFilter] = useState<'all' | 'Food' | 'Hotel'>('all');

  // Filter nearby activities based on selected filter
  const filteredNearby = useMemo(() => {
    if (nearbyFilter === 'all') return nearby;
    return nearby.filter(activity => activity.category === nearbyFilter);
  }, [nearby, nearbyFilter]);

  // Combine all locations for search
  const allLocations = useMemo(() => [
    ...featured,
    ...heritage,
    ...nearby
  ], [featured, heritage, nearby]);

  // Filter locations based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allLocations.filter(loc => 
      loc.name.toLowerCase().includes(query) ||
      loc.subtitle?.toLowerCase().includes(query) ||
      loc.description?.toLowerCase().includes(query) ||
      loc.category?.toLowerCase().includes(query)
    );
  }, [searchQuery, allLocations]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(e.target.value.length > 0);
  };

  const handleSelectFromSearch = (location: Location) => {
    setSearchQuery('');
    setShowSearchResults(false);
    onSelectLocation(location);
  };

  return (
    <div className="relative flex flex-col w-full pb-32 bg-background-dark text-gray-200">
      {/* Immersive Video Header Section */}
      <div className="relative w-full h-[50vh] min-h-[420px] overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <iframe 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] md:w-[120%] md:h-[120%] pointer-events-none"
            src={`https://www.youtube.com/embed/zfE-384HTFc?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=zfE-384HTFc&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
            title="Découvrez le Bénin"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        {/* Fallback image for slow connections */}
        <div className="absolute inset-0 w-full h-full bg-cover bg-center -z-10" style={{ backgroundImage: `url('${IMAGES.hero}')` }}></div>
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-navy-dark/50 to-background-dark z-[1]"></div>
        
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 pt-14">
          <div className="flex flex-col">
            <span className="text-primary text-[11px] font-bold tracking-[0.25em] uppercase mb-2 border-l-2 border-primary pl-2">{t('welcome_msg')}</span>
          </div>
          <div className="flex items-center gap-2 relative">
            <button 
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors text-xs font-bold border border-white/30"
            >
              {language === 'en' ? 'FR' : 'EN'}
            </button>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="bg-charcoal-dark/50 backdrop-blur-md text-primary border border-primary/30 w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary hover:text-navy-dark transition-all shadow-glow relative"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute top-14 right-0 w-72 bg-white dark:bg-[#2c241b] rounded-2xl shadow-xl p-4 z-50 border border-gray-100 dark:border-gray-700 animation-fade-in-down">
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">Notifications</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-sm">confirmation_number</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Booking Confirmed</p>
                      <p className="text-xs text-gray-500">Your trip to Ouidah is confirmed for tomorrow.</p>
                    </div>
                  </div>
                   <div className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-sm">discount</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">20% Off Tours</p>
                      <p className="text-xs text-gray-500">Limited time offer for Pendjari Safari.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sound Toggle Button */}
        <div className="absolute bottom-6 right-6 z-10">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="w-12 h-12 rounded-full bg-charcoal-dark/60 backdrop-blur-sm border border-primary/40 flex items-center justify-center shadow-lg hover:bg-primary hover:text-navy-dark transition-all group"
          >
            <span className="material-symbols-outlined text-white group-hover:text-navy-dark">
              {isMuted ? 'volume_off' : 'volume_up'}
            </span>
          </button>
        </div>

      </div>

      {/* Floating Search Bar */}
      <div className="relative px-6 -mt-10 z-20">
        <div className="bg-charcoal-card/90 backdrop-blur-xl rounded-xl shadow-2xl shadow-black/70 p-1.5 flex items-center gap-2 border border-primary/20 ring-1 ring-white/5">
          <span className="material-symbols-outlined text-primary/80 ml-3">search</span>
          <input 
            className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-white placeholder:text-gray-500 h-11 font-serif tracking-wide" 
            placeholder={t('search_placeholder')}
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => searchQuery && setShowSearchResults(true)}
          />
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(''); setShowSearchResults(false); }}
              className="text-gray-400 hover:text-white p-2"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
          <button className="bg-primary text-navy-dark w-11 h-11 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary-light transition-colors">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && (
          <div className="absolute top-full left-6 right-6 mt-2 bg-charcoal-card/95 backdrop-blur-xl rounded-xl shadow-2xl border border-primary/20 max-h-80 overflow-y-auto z-50">
            {searchResults.length > 0 ? (
              <div className="p-2">
                <p className="text-xs text-gray-500 px-3 py-2">{searchResults.length} {t('results') || 'résultat(s)'}</p>
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => handleSelectFromSearch(result)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <div 
                      className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0"
                      style={{ backgroundImage: `url('${result.image}')` }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">{result.name}</h4>
                      <p className="text-xs text-gray-400 truncate">{result.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                      <span className="material-symbols-outlined text-sm">star</span>
                      <span className="text-xs font-bold">{result.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <span className="material-symbols-outlined text-4xl text-gray-600 mb-2">search_off</span>
                <p className="text-gray-400 text-sm">{t('no_results') || 'Aucun résultat trouvé'}</p>
                <p className="text-gray-500 text-xs mt-1">{t('try_another') || 'Essayez un autre terme'}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Overlay to close search */}
      {showSearchResults && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowSearchResults(false)}
        />
      )}

      {/* Curated Journeys */}
      <section className="mt-12">
        <div className="flex items-end justify-between px-6 mb-6">
          <div>
            <span className="text-primary text-[10px] uppercase tracking-widest font-bold">Discover</span>
            <h2 className="text-2xl font-serif font-medium text-white">{t('featured')}</h2>
          </div>
          <a className="text-primary/80 text-xs font-serif italic border-b border-primary/30 pb-0.5 hover:text-primary transition-colors" href="#">{t('see_all')}</a>
        </div>
        <div className="flex overflow-x-auto gap-5 px-6 pb-8 no-scrollbar snap-x snap-mandatory">
          {featured.map((dest) => (
            <div key={dest.id} className="snap-start shrink-0 w-64 h-80 relative rounded-[20px] overflow-hidden group shadow-xl shadow-black/50 border border-white/10 hover:border-primary/40 transition-colors cursor-pointer" onClick={() => onSelectLocation(dest)}>
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: `url('${dest.image}')` }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark via-charcoal-dark/20 to-transparent opacity-90"></div>
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-2xl font-serif text-white">{dest.name}</h3>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[16px] fill-1">star</span>
                    <span className="text-sm font-bold text-primary-light">{dest.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 font-display uppercase tracking-widest mb-1">{dest.subtitle}</p>
                <div className="w-8 h-[1px] bg-primary mt-2"></div>
              </div>
              <button className="absolute top-3 right-3 bg-charcoal-dark/40 backdrop-blur-md p-2 rounded-full text-white border border-white/10 hover:bg-primary hover:text-navy-dark hover:border-primary transition-all">
                <span className="material-symbols-outlined text-[20px]">favorite</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Heritage Sites */}
      <section className="mt-4 px-6">
        <h2 className="text-2xl font-serif font-medium text-white mb-5">{t('heritage_sites')}</h2>
        <div className="grid grid-cols-2 gap-4">
          {heritage.map((site) => (
            <div key={site.id} className="bg-charcoal-card border border-white/5 rounded-2xl overflow-hidden shadow-lg hover:shadow-gold hover:border-primary/30 transition-all duration-300 group cursor-pointer" onClick={() => onSelectLocation(site)}>
              <div className="h-36 bg-cover bg-center relative" style={{ backgroundImage: `url('${site.image}')` }}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="p-4 relative">
                <div className="absolute -top-8 right-3 bg-primary w-8 h-8 rounded-full flex items-center justify-center shadow-lg text-navy-dark">
                  <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                </div>
                <h3 className="text-base font-serif text-white line-clamp-1">{site.name}</h3>
                <div className="flex items-center mt-2">
                  <span className="material-symbols-outlined text-primary text-[14px] mr-1.5">location_on</span>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{site.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nearby Experiences */}
      <section className="mt-12 px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-medium text-white">{t('nearby')}</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setNearbyFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${nearbyFilter === 'all' ? 'bg-primary text-navy-dark shadow-glow border border-primary' : 'bg-transparent border border-white/10 text-gray-400 hover:text-primary hover:border-primary/50'}`}
            >{t('all')}</button>
            <button 
              onClick={() => setNearbyFilter('Food')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${nearbyFilter === 'Food' ? 'bg-primary text-navy-dark shadow-glow border border-primary' : 'bg-transparent border border-white/10 text-gray-400 hover:text-primary hover:border-primary/50'}`}
            >{t('food')}</button>
            <button 
              onClick={() => setNearbyFilter('Hotel')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${nearbyFilter === 'Hotel' ? 'bg-primary text-navy-dark shadow-glow border border-primary' : 'bg-transparent border border-white/10 text-gray-400 hover:text-primary hover:border-primary/50'}`}
            >{t('hotels')}</button>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          {filteredNearby.map((activity) => (
            <div key={activity.id} className="flex gap-4 p-3 rounded-2xl bg-charcoal-card border border-white/5 shadow-lg items-center relative overflow-hidden group hover:border-primary/30 transition-all cursor-pointer" onClick={() => onSelectLocation(activity)}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full pointer-events-none"></div>
              <div className="w-24 h-24 rounded-xl bg-cover bg-center shrink-0 shadow-inner border border-white/5" style={{ backgroundImage: `url('${activity.image}')` }}></div>
              <div className="flex-1 z-10 pr-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-serif text-lg text-white">{activity.name}</h3>
                  <span className="text-primary font-bold text-[10px] bg-primary/10 border border-primary/20 px-2 py-0.5 rounded shadow-sm">{activity.price}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 font-display tracking-wide uppercase">{activity.subtitle}</p>
                <div className="flex items-center mt-3 gap-4 text-xs text-gray-400">
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-primary text-[16px] mr-1">location_on</span>
                    {activity.distance}
                  </div>
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-primary text-[16px] mr-1 fill-1">star</span>
                    <span className="text-gray-200">{activity.rating}</span> <span className="ml-1 text-[10px] opacity-50">({activity.reviews})</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="h-8"></div>

    </div>
  );
};
