import React, { useState } from 'react';
import { IMAGES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

export const Profile: React.FC = () => {
  const { t } = useLanguage();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark pb-24 overflow-y-auto">
      {/* Header Profile Card */}
      <div className="relative bg-white dark:bg-[#2c241b] pb-8 rounded-b-[2.5rem] shadow-sm z-10">
        <div className="absolute top-0 left-0 w-full h-32 bg-primary/10 rounded-b-[2.5rem]"></div>
        <div className="flex flex-col items-center pt-16 px-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-white dark:border-[#2c241b] shadow-lg bg-cover bg-center" style={{ backgroundImage: `url('${IMAGES.user}')` }}></div>
            <button className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary-dark">
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>
          <h1 className="text-2xl font-bold mt-4 text-slate-900 dark:text-white">Sarah Jenkins</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Explorer Level 3 • Benin Lover</p>
          
          <div className="flex gap-6 mt-6 w-full justify-center">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-slate-900 dark:text-white">12</span>
              <span className="text-xs text-gray-400 uppercase tracking-wide">Trips</span>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-slate-900 dark:text-white">45</span>
              <span className="text-xs text-gray-400 uppercase tracking-wide">Reviews</span>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-slate-900 dark:text-white">850</span>
              <span className="text-xs text-gray-400 uppercase tracking-wide">Points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="px-6 py-6 flex flex-col gap-6">
        
        {/* Account Section */}
        <section>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Account</h3>
          <div className="bg-white dark:bg-[#2c241b] rounded-2xl p-2 shadow-sm">
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">Personal Information</span>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </button>
            <div className="h-px bg-gray-100 dark:bg-gray-700 mx-3"></div>
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">credit_card</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">Payment Methods</span>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Preferences Section */}
        <section>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Preferences</h3>
          <div className="bg-white dark:bg-[#2c241b] rounded-2xl p-2 shadow-sm">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">notifications</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">Notifications</span>
              </div>
              <button 
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${notificationsEnabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
            <div className="h-px bg-gray-100 dark:bg-gray-700 mx-3"></div>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                  <span className="material-symbols-outlined">dark_mode</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">Dark Mode</span>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>
        </section>

         <button className="w-full py-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
            <span className="material-symbols-outlined">logout</span> Log Out
         </button>

      </div>
    </div>
  );
};
