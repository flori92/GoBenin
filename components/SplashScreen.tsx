import React, { useEffect, useState } from 'react';
import { IMAGES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface SplashProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashProps> = ({ onFinish }) => {
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      onFinish();
    }, 3000); // 3 seconds splash
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="relative h-screen w-full flex flex-col justify-between overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-cover bg-center scale-105" style={{ backgroundImage: `url('${IMAGES.splash}')`, filter: 'blur(2px)' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#221b10]/30 via-[#221b10]/40 to-[#221b10]/70 z-10"></div>
      </div>

      <div className={`relative z-20 flex flex-col h-full w-full justify-between pt-20 pb-12 px-8 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex-1"></div>
        
        {/* Center Content */}
        <div className="flex flex-col items-center justify-center flex-[2]">
          <div className="mb-6 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '64px' }}>travel_explore</span>
          </div>
          <h1 className="text-white text-5xl font-extrabold tracking-tight mb-3 drop-shadow-md text-center">
             Go<span className="text-primary">Bénin</span>
          </h1>
          <div className="w-16 h-1 bg-primary rounded-full mb-5 opacity-90"></div>
          <p className="text-white/90 text-lg font-light tracking-widest uppercase text-center drop-shadow-sm max-w-[280px] leading-relaxed">
            {t('splash_text')}
          </p>
        </div>

        {/* Loader */}
        <div className="flex flex-col items-center justify-end flex-1 gap-6">
          <div className="w-full max-w-[140px] flex flex-col items-center gap-3">
            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
               <div className="h-full bg-primary w-1/3 rounded-full animate-[pulse_1.5s_infinite] shadow-[0_0_10px_rgba(238,166,43,0.6)]"></div>
            </div>
            <span className="text-white/60 text-xs font-medium tracking-wide uppercase">{t('splash_loading')}</span>
          </div>
          <p className="text-white/30 text-[10px] font-medium tracking-widest mt-4">v1.1.0</p>
        </div>
      </div>
    </div>
  );
};
