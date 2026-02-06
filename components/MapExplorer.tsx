import React from 'react';
import { IMAGES, getHeritageSites, getFeaturedDestinations } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { Location } from '../types';

interface MapExplorerProps {
  onSelectLocation?: (location: Location) => void;
}

export const MapExplorer: React.FC<MapExplorerProps> = ({ onSelectLocation }) => {
  const { t, language } = useLanguage();
  
  // Get actual data objects to pass to details view
  const heritageSites = getHeritageSites(language);
  const featured = getFeaturedDestinations(language);
  
  const pendjariData = heritageSites.find(s => s.id === 'pendjari');
  const palacesData = heritageSites.find(s => s.id === 'royal-palaces');
  // Ouidah is in featured, find it
  const ouidahData = featured.find(f => f.id === 'ouidah');

  const handleMarkerClick = (data?: Location) => {
    if (data && onSelectLocation) {
      onSelectLocation(data);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col relative bg-[#e5e0d8]">
      {/* Map Layer */}
      <div className="absolute inset-0 z-0 w-full h-full bg-cover bg-center opacity-90" style={{ backgroundImage: `url('${IMAGES.map}')`, filter: 'grayscale(20%) contrast(90%) brightness(110%)' }}></div>
      
      {/* Markers - Made interactive */}
      
      {/* Pendjari Marker */}
      <div 
        onClick={() => handleMarkerClick(pendjariData)}
        className="absolute top-[20%] left-[25%] flex flex-col items-center gap-1 cursor-pointer transform hover:scale-110 transition-transform z-0 group"
      >
        <div className="relative flex items-center justify-center size-10 bg-primary rounded-full shadow-lg border-2 border-white text-white group-active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-xl">park</span>
        </div>
        <div className="bg-white/90 backdrop-blur px-2 py-1 rounded-md shadow-sm text-xs font-bold text-black whitespace-nowrap">W-Arly-Pendjari</div>
        <div className="absolute top-9 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-primary"></div>
      </div>

      {/* Royal Palaces Marker */}
      <div 
        onClick={() => handleMarkerClick(palacesData)}
        className="absolute top-[60%] left-[45%] flex flex-col items-center gap-1 cursor-pointer transform hover:scale-110 transition-transform z-10 animate-bounce group"
      >
         <div className="relative flex items-center justify-center size-12 bg-primary rounded-full shadow-lg border-[3px] border-white text-white group-active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-2xl">castle</span>
        </div>
        <div className="bg-white/90 backdrop-blur px-2 py-1 rounded-md shadow-sm text-xs font-bold text-black whitespace-nowrap">{t('history')}</div>
        <div className="absolute top-11 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-primary"></div>
      </div>

      {/* Ouidah Marker */}
      <div 
        onClick={() => handleMarkerClick(ouidahData)}
        className="absolute top-[75%] left-[55%] flex flex-col items-center gap-1 cursor-pointer transform hover:scale-110 transition-transform z-0 group"
      >
         <div className="relative flex items-center justify-center size-10 bg-primary rounded-full shadow-lg border-2 border-white text-white group-active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-xl">museum</span>
        </div>
        <div className="bg-white/90 backdrop-blur px-2 py-1 rounded-md shadow-sm text-xs font-bold text-black whitespace-nowrap">Ouidah</div>
        <div className="absolute top-9 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-primary"></div>
      </div>

      {/* Top Search Area */}
      <div className="relative z-10 pt-12 px-4 pb-4 w-full bg-gradient-to-b from-white/80 to-transparent pointer-events-none">
        <div className="flex flex-col gap-3 max-w-md mx-auto w-full pointer-events-auto">
          <label className="flex w-full items-center h-12 rounded-xl bg-white shadow-lg border border-gray-100">
             <div className="flex items-center justify-center pl-4 text-primary"><span className="material-symbols-outlined">search</span></div>
             <input className="w-full bg-transparent border-none text-slate-900 placeholder:text-gray-400 focus:ring-0 text-base font-medium px-3" placeholder={t('search_tours')} />
             <button className="flex items-center justify-center pr-4 text-gray-400"><span className="material-symbols-outlined">tune</span></button>
          </label>
           <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-full shadow-sm whitespace-nowrap text-sm font-semibold"><span className="material-symbols-outlined text-lg">forest</span> {t('nature')}</button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-white text-slate-900 rounded-full shadow-sm whitespace-nowrap text-sm font-medium border border-gray-100"><span className="material-symbols-outlined text-lg text-primary">temple_buddhist</span> {t('culture')}</button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-white text-slate-900 rounded-full shadow-sm whitespace-nowrap text-sm font-medium border border-gray-100"><span className="material-symbols-outlined text-lg text-primary">history_edu</span> {t('history')}</button>
           </div>
        </div>
      </div>

      <div className="flex-1"></div>

      {/* Carousel */}
      <div className="relative z-10 w-full bg-gradient-to-t from-background-light via-background-light/90 to-transparent dark:from-background-dark dark:via-background-dark/90 pb-24 pt-10">
         <div className="flex justify-end px-4 mb-4 gap-3">
            <button className="flex size-12 items-center justify-center rounded-full bg-white dark:bg-[#2c241b] text-slate-900 dark:text-white shadow-lg active:scale-95 transition-transform">
                <span className="material-symbols-outlined">my_location</span>
            </button>
         </div>
         <div className="w-full overflow-x-auto no-scrollbar px-4 pb-2">
            <div className="flex gap-4 w-max">
                <div 
                  onClick={() => handleMarkerClick(palacesData)}
                  className="flex flex-col w-[280px] bg-white dark:bg-[#2c241b] rounded-2xl p-3 shadow-lg border-2 border-primary cursor-pointer active:scale-95 transition-transform"
                >
                    <div className="relative w-full h-32 rounded-xl overflow-hidden mb-3">
                         <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${IMAGES.palaceDetail}')` }}></div>
                         <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <span className="material-symbols-outlined text-primary text-sm fill-1">star</span><span className="text-xs font-bold text-black">4.8</span>
                         </div>
                    </div>
                    <div className="px-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Royal Palaces of Abomey</h3>
                        <p className="text-primary text-sm font-medium mt-1">Cultural Heritage</p>
                        <div className="flex items-center gap-1 mt-2 text-gray-500 text-xs"><span className="material-symbols-outlined text-sm">near_me</span> 12 km away</div>
                    </div>
                </div>

                 <div 
                   onClick={() => handleMarkerClick(pendjariData)}
                   className="flex flex-col w-[280px] bg-white dark:bg-[#2c241b] rounded-2xl p-3 shadow-md border border-gray-100 dark:border-gray-700 cursor-pointer opacity-90 active:scale-95 transition-transform"
                >
                    <div className="relative w-full h-32 rounded-xl overflow-hidden mb-3">
                         <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${IMAGES.pendjari}')` }}></div>
                         <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <span className="material-symbols-outlined text-primary text-sm fill-1">star</span><span className="text-xs font-bold text-black">4.9</span>
                         </div>
                    </div>
                    <div className="px-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">W-Arly-Pendjari</h3>
                        <p className="text-primary text-sm font-medium mt-1">Nature Reserve</p>
                        <div className="flex items-center gap-1 mt-2 text-gray-500 text-xs"><span className="material-symbols-outlined text-sm">near_me</span> 240 km away</div>
                    </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};
