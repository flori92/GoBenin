import React from 'react';
import { ViewState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface NavigationProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  const getIconClass = (view: ViewState) => {
    return currentView === view ? "text-primary" : "text-gray-400 dark:text-gray-500 hover:text-primary transition-colors";
  };

  const isActive = (view: ViewState) => currentView === view;

  return (
    <nav className={`fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t px-8 py-5 flex justify-between items-center z-50 safe-area-bottom transition-colors duration-300 ${theme === 'dark' ? 'bg-charcoal-dark/95 border-white/5 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.8)]' : 'bg-white/95 border-gray-200 shadow-lg'}`}>
      <button onClick={() => onChangeView('HOME')} className={`flex flex-col items-center gap-1.5 ${isActive('HOME') ? 'text-primary' : 'text-gray-500 hover:text-primary'} transition-colors relative`}>
        {isActive('HOME') && <div className="absolute -top-5 w-10 h-0.5 bg-primary rounded-full shadow-glow"></div>}
        <span className={`material-symbols-outlined ${isActive('HOME') ? 'fill-1 drop-shadow-md' : ''}`}>home</span>
        <span className={`text-[10px] tracking-widest uppercase ${isActive('HOME') ? 'font-bold' : 'font-medium'}`}>{t('home')}</span>
      </button>

      <button onClick={() => onChangeView('MAP')} className={`flex flex-col items-center gap-1.5 ${isActive('MAP') ? 'text-primary' : 'text-gray-500 hover:text-primary'} transition-colors relative`}>
        {isActive('MAP') && <div className="absolute -top-5 w-10 h-0.5 bg-primary rounded-full shadow-glow"></div>}
        <span className={`material-symbols-outlined ${isActive('MAP') ? 'fill-1 drop-shadow-md' : ''}`}>map</span>
        <span className={`text-[10px] tracking-widest uppercase ${isActive('MAP') ? 'font-bold' : 'font-medium'}`}>{t('map')}</span>
      </button>

      <button onClick={() => onChangeView('TOURS')} className={`flex flex-col items-center gap-1.5 ${isActive('TOURS') ? 'text-primary' : 'text-gray-500 hover:text-primary'} transition-colors relative`}>
        {isActive('TOURS') && <div className="absolute -top-5 w-10 h-0.5 bg-primary rounded-full shadow-glow"></div>}
        <span className={`material-symbols-outlined ${isActive('TOURS') ? 'fill-1 drop-shadow-md' : ''}`}>explore</span>
        <span className={`text-[10px] tracking-widest uppercase ${isActive('TOURS') ? 'font-bold' : 'font-medium'}`}>{t('tours')}</span>
      </button>

      <button onClick={() => onChangeView('BOOKINGS')} className={`flex flex-col items-center gap-1.5 ${isActive('BOOKINGS') ? 'text-primary' : 'text-gray-500 hover:text-primary'} transition-colors relative`}>
        {isActive('BOOKINGS') && <div className="absolute -top-5 w-10 h-0.5 bg-primary rounded-full shadow-glow"></div>}
        <div className="relative">
          <span className={`material-symbols-outlined ${isActive('BOOKINGS') ? 'fill-1 drop-shadow-md' : ''}`}>calendar_month</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full shadow-glow animate-pulse"></span>
        </div>
        <span className={`text-[10px] tracking-widest uppercase ${isActive('BOOKINGS') ? 'font-bold' : 'font-medium'}`}>{t('bookings')}</span>
      </button>

      <button onClick={() => onChangeView('PROFILE')} className={`flex flex-col items-center gap-1.5 ${isActive('PROFILE') ? 'text-primary' : 'text-gray-500 hover:text-primary'} transition-colors relative`}>
        {isActive('PROFILE') && <div className="absolute -top-5 w-10 h-0.5 bg-primary rounded-full shadow-glow"></div>}
        <span className={`material-symbols-outlined ${isActive('PROFILE') ? 'fill-1 drop-shadow-md' : ''}`}>person</span>
        <span className={`text-[10px] tracking-widest uppercase ${isActive('PROFILE') ? 'font-bold' : 'font-medium'}`}>{t('profile')}</span>
      </button>
    </nav>
  );
};
