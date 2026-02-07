import React, { useState } from 'react';
import { IMAGES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useUserProgress, EXPLORER_LEVELS } from '../contexts/UserProgressContext';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'kkiapay' | 'fedapay' | 'card' | 'mobile';
  icon: string;
  color: string;
  details?: string;
  detailsKey?: string;
  isDefault?: boolean;
}

export const Profile: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { 
    trips, reviews, points, badges, 
    currentLevel, progressToNextLevel,
    pointsHistory, recentAchievement, clearRecentAchievement
  } = useUserProgress();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLevelDetails, setShowLevelDetails] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [showPointsHistory, setShowPointsHistory] = useState(false);
  const [showTripsHistory, setShowTripsHistory] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: '1', name: 'KKiaPay', type: 'kkiapay', icon: '💳', color: 'bg-blue-500', detailsKey: 'mobile_money_cards', isDefault: true },
    { id: '2', name: 'FedaPay', type: 'fedapay', icon: '🏦', color: 'bg-green-500', detailsKey: 'mtn_moov_cards' },
  ]);

  const [userInfo, setUserInfo] = useState({
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@email.com',
    phone: '+229 97 00 00 00',
    country: 'Bénin'
  });

  const nextLevel = EXPLORER_LEVELS.find(l => l.level === currentLevel.level + 1);
  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);
  const dateLocale = language === 'fr' ? 'fr-FR' : 'en-US';

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  const handleEditField = (field: string, value: string) => {
    setEditingField(field);
    setTempValue(value);
  };

  const handleSaveField = (field: string) => {
    setUserInfo(prev => ({ ...prev, [field]: tempValue }));
    setEditingField(null);
  };

  const handleSetDefaultPayment = (id: string) => {
    setPaymentMethods(prev => prev.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })));
  };

  const handleRemovePayment = (id: string) => {
    setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
  };

  const handleAddPaymentMethod = (type: 'kkiapay' | 'fedapay') => {
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      name: type === 'kkiapay' ? 'KKiaPay' : 'FedaPay',
      type,
      icon: type === 'kkiapay' ? '💳' : '🏦',
      color: type === 'kkiapay' ? 'bg-blue-500' : 'bg-green-500',
      detailsKey: type === 'kkiapay' ? 'mobile_money_cards' : 'mtn_moov_cards',
    };
    setPaymentMethods(prev => [...prev, newMethod]);
  };

  return (
    <div className={`flex flex-col h-full pb-24 overflow-y-auto transition-colors duration-300 ${theme === 'dark' ? 'bg-background-dark' : 'bg-gray-50'}`}>
      {/* Achievement Toast */}
      {recentAchievement && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className={`px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 ${theme === 'dark' ? 'bg-charcoal-card border border-primary/30' : 'bg-white'}`}>
            <div className={`w-14 h-14 rounded-xl ${recentAchievement.color} flex items-center justify-center text-3xl`}>
              {recentAchievement.icon}
            </div>
            <div>
              <p className="text-xs text-primary font-bold uppercase">{t('new_badge')}</p>
              <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{recentAchievement.name}</p>
              <p className="text-xs text-gray-400">{recentAchievement.description}</p>
            </div>
            <button onClick={clearRecentAchievement} className="text-gray-400 hover:text-white ml-2">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Header Profile Card */}
      <div className={`relative pb-6 rounded-b-[2.5rem] shadow-lg z-10 ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`}>
        <div className={`absolute top-0 left-0 w-full h-36 bg-gradient-to-br ${currentLevel.color} opacity-20 rounded-b-[2.5rem]`}></div>
        <div className="flex flex-col items-center pt-14 px-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-primary/30 shadow-glow bg-cover bg-center" style={{ backgroundImage: `url('${IMAGES.user}')` }}></div>
            <button className="absolute bottom-0 right-0 bg-primary text-navy-dark p-1.5 rounded-full shadow-lg hover:bg-primary-light transition-colors">
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
            {/* Level badge */}
            <div className="absolute -top-1 -right-1 text-2xl">{currentLevel.icon}</div>
          </div>
          <h1 className={`text-xl font-serif font-bold mt-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{userInfo.name}</h1>
          
          {/* Level & Progress */}
          <button 
            onClick={() => setShowLevelDetails(true)}
            className={`mt-2 px-4 py-1.5 rounded-full flex items-center gap-2 transition-all ${theme === 'dark' ? 'bg-charcoal-light/50 hover:bg-charcoal-light' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <span className="text-lg">{currentLevel.icon}</span>
            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {currentLevel.name} • {t('level')} {currentLevel.level}
            </span>
            <span className="material-symbols-outlined text-primary text-[16px]">chevron_right</span>
          </button>
          
          {/* Progress bar */}
          <div className="w-full max-w-[200px] mt-3">
            <div className={`h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-charcoal-light' : 'bg-gray-200'}`}>
              <div 
                className={`h-full bg-gradient-to-r ${currentLevel.color} transition-all duration-500`}
                style={{ width: `${Math.min(progressToNextLevel, 100)}%` }}
              ></div>
            </div>
            {nextLevel && (
              <p className="text-[10px] text-gray-400 text-center mt-1">
                {t('to_next_level', { 
                  current: points - currentLevel.minPoints, 
                  target: nextLevel.minPoints - currentLevel.minPoints, 
                  levelName: nextLevel.name 
                })}
              </p>
            )}
          </div>
          
          {/* Stats */}
          <div className="flex gap-4 mt-5 w-full justify-center">
            <button 
              onClick={() => setShowTripsHistory(true)}
              className={`flex flex-col items-center p-3 rounded-xl transition-all ${theme === 'dark' ? 'hover:bg-charcoal-light/30' : 'hover:bg-gray-50'}`}
            >
              <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{trips.length}</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wide">{t('trips_label')}</span>
            </button>
            <div className={`w-px h-12 self-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <button 
              onClick={() => setShowReviews(true)}
              className={`flex flex-col items-center p-3 rounded-xl transition-all ${theme === 'dark' ? 'hover:bg-charcoal-light/30' : 'hover:bg-gray-50'}`}
            >
              <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{reviews.length}</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wide">{t('reviews_label')}</span>
            </button>
            <div className={`w-px h-12 self-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <button 
              onClick={() => setShowPointsHistory(true)}
              className={`flex flex-col items-center p-3 rounded-xl transition-all ${theme === 'dark' ? 'hover:bg-charcoal-light/30' : 'hover:bg-gray-50'}`}
            >
              <span className={`text-2xl font-bold text-primary`}>{points}</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wide">{t('points_label')}</span>
            </button>
          </div>
          
          {/* Badges preview */}
          <button 
            onClick={() => setShowBadges(true)}
            className={`mt-4 w-full p-3 rounded-xl flex items-center justify-between transition-all ${theme === 'dark' ? 'bg-charcoal-light/30 hover:bg-charcoal-light/50' : 'bg-gray-50 hover:bg-gray-100'}`}
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {unlockedBadges.slice(0, 4).map((badge) => (
                  <div key={badge.id} className={`w-8 h-8 rounded-full ${badge.color} flex items-center justify-center text-sm border-2 ${theme === 'dark' ? 'border-charcoal-card' : 'border-white'}`}>
                    {badge.icon}
                  </div>
                ))}
                {unlockedBadges.length > 4 && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${theme === 'dark' ? 'bg-charcoal-light border-charcoal-card text-white' : 'bg-gray-200 border-white text-slate-900'}`}>
                    +{unlockedBadges.length - 4}
                  </div>
                )}
              </div>
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {t('badges', { count: unlockedBadges.length })}
              </span>
            </div>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Settings List */}
      <div className="px-6 py-6 flex flex-col gap-6">
        
        {/* Account Section */}
        <section>
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">{t('account')}</h3>
          <div className={`rounded-2xl p-2 shadow-lg ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`}>
            <button 
              onClick={() => setShowPersonalInfo(true)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('personal_info')}</span>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </button>
            <div className={`h-px mx-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
            <button 
              onClick={() => setShowPaymentMethods(true)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">credit_card</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('payment_methods')}</span>
                  <span className="text-xs text-gray-400">{t('payment_methods_desc')}</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Preferences Section */}
        <section>
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">{t('preferences')}</h3>
          <div className={`rounded-2xl p-2 shadow-lg ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`}>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">notifications</span>
                </div>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('notifications')}</span>
              </div>
              <button 
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-14 h-7 rounded-full p-1 transition-all duration-300 ${notificationsEnabled ? 'bg-primary shadow-glow' : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${notificationsEnabled ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </button>
            </div>
            <div className={`h-px mx-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}>
                  <span className="material-symbols-outlined">{theme === 'dark' ? 'dark_mode' : 'light_mode'}</span>
                </div>
                <div className="flex flex-col">
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('theme_mode')} {theme === 'dark' ? t('dark_mode') : t('light_mode')}</span>
                  <span className="text-xs text-gray-400">{theme === 'dark' ? t('dark_mode_on') : t('light_mode_on')}</span>
                </div>
              </div>
              <button 
                onClick={toggleTheme}
                className={`w-14 h-7 rounded-full p-1 transition-all duration-300 ${theme === 'dark' ? 'bg-primary shadow-glow' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </button>
            </div>
            <div className={`h-px mx-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
            <button 
              onClick={() => setShowLanguageModal(true)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">translate</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('language_label')}</span>
                  <span className="text-xs text-gray-400">{language === 'fr' ? 'Français' : 'English'}</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Services Section */}
        <section>
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">{t('services')}</h3>
          <div className={`rounded-2xl p-2 shadow-lg ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`}>
            <a 
              href="https://evisa.bj" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">travel_explore</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('evisa_title')}</span>
                  <span className="text-xs text-gray-400">{t('evisa_desc')}</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary">open_in_new</span>
            </a>
          </div>
        </section>

        {/* Support Section */}
        <section>
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">{t('support')}</h3>
          <div className={`rounded-2xl p-2 shadow-lg ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`}>
            <button className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">help</span>
                </div>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('help_faq')}</span>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </button>
            <div className={`h-px mx-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
            <button className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('contact_us')}</span>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </button>
          </div>
        </section>

        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${theme === 'dark' ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
        >
          <span className="material-symbols-outlined">logout</span> {t('logout')}
        </button>
      </div>

      {/* Personal Info Modal */}
      {showPersonalInfo && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowPersonalInfo(false)}>
          <div className={`w-full max-w-lg rounded-t-3xl p-6 pb-10 max-h-[80vh] overflow-y-auto animate-slide-up ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-serif ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('personal_info')}</h2>
              <button onClick={() => setShowPersonalInfo(false)} className="text-gray-400 hover:text-white p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            {Object.entries(userInfo).map(([key, value]) => (
              <div key={key} className={`p-4 rounded-xl mb-3 ${theme === 'dark' ? 'bg-charcoal-light/30' : 'bg-gray-50'}`}>
                <label className="text-xs text-gray-400 uppercase tracking-wide">
                  {key === 'name' ? t('full_name') : key === 'email' ? t('email') : key === 'phone' ? t('phone') : t('country')}
                </label>
                {editingField === key ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input 
                      type="text" 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className={`flex-1 bg-transparent border-b-2 border-primary py-1 focus:outline-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
                      autoFocus
                    />
                    <button onClick={() => handleSaveField(key)} className="text-primary">
                      <span className="material-symbols-outlined">check</span>
                    </button>
                    <button onClick={() => setEditingField(null)} className="text-gray-400">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-1">
                    <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{value}</span>
                    <button onClick={() => handleEditField(key, String(value))} className="text-primary">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Methods Modal */}
      {showPaymentMethods && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowPaymentMethods(false)}>
          <div className={`w-full max-w-lg rounded-t-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto animate-slide-up ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-serif ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('payment_methods')}</h2>
              <button onClick={() => setShowPaymentMethods(false)} className="text-gray-400 hover:text-white p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Payment Aggregators Info */}
            <div className={`p-4 rounded-xl mb-4 border ${theme === 'dark' ? 'bg-primary/10 border-primary/30' : 'bg-blue-50 border-blue-200'}`}>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                🇧🇯 {t('payment_info')}
              </p>
            </div>
            
            {/* Current Payment Methods */}
            <div className="space-y-3 mb-6">
              {paymentMethods.map(pm => (
                <div key={pm.id} className={`p-4 rounded-xl flex items-center justify-between ${theme === 'dark' ? 'bg-charcoal-light/30' : 'bg-gray-50'} ${pm.isDefault ? 'border-2 border-primary' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${pm.color} flex items-center justify-center text-white text-2xl`}>
                      {pm.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{pm.name}</span>
                        {pm.isDefault && (
                          <span className="text-[10px] bg-primary text-navy-dark px-2 py-0.5 rounded-full font-bold">{t('default_label')}</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{pm.detailsKey ? t(pm.detailsKey) : pm.details}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!pm.isDefault && (
                      <button 
                        onClick={() => handleSetDefaultPayment(pm.id)}
                        className="text-primary text-xs font-semibold hover:underline"
                      >
                        {t('set_default')}
                      </button>
                    )}
                    <button 
                      onClick={() => handleRemovePayment(pm.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Payment Method */}
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t('add_method')}</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleAddPaymentMethod('kkiapay')}
                className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all border-2 border-dashed ${theme === 'dark' ? 'border-blue-500/50 hover:border-blue-500 hover:bg-blue-500/10' : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'}`}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white text-2xl">💳</div>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>KKiaPay</span>
                <span className="text-[10px] text-gray-400 text-center">{t('mobile_money_cards')}</span>
              </button>
              <button 
                onClick={() => handleAddPaymentMethod('fedapay')}
                className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all border-2 border-dashed ${theme === 'dark' ? 'border-green-500/50 hover:border-green-500 hover:bg-green-500/10' : 'border-green-300 hover:border-green-500 hover:bg-green-50'}`}
              >
                <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-white text-2xl">🏦</div>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>FedaPay</span>
                <span className="text-[10px] text-gray-400 text-center">{t('mtn_moov_cards')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowLanguageModal(false)}>
          <div className={`w-full max-w-sm rounded-2xl p-6 mx-4 animate-fade-in ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <h2 className={`text-xl font-serif mb-4 text-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('choose_language')}</h2>
            <div className="space-y-2">
              <button 
                onClick={() => { setLanguage('fr'); setShowLanguageModal(false); }}
                className={`w-full p-4 rounded-xl flex items-center justify-between transition-colors ${language === 'fr' ? 'bg-primary text-navy-dark' : theme === 'dark' ? 'bg-charcoal-light/30 text-white hover:bg-charcoal-light/50' : 'bg-gray-50 text-slate-900 hover:bg-gray-100'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇫🇷</span>
                  <span className="font-semibold">Français</span>
                </div>
                {language === 'fr' && <span className="material-symbols-outlined">check</span>}
              </button>
              <button 
                onClick={() => { setLanguage('en'); setShowLanguageModal(false); }}
                className={`w-full p-4 rounded-xl flex items-center justify-between transition-colors ${language === 'en' ? 'bg-primary text-navy-dark' : theme === 'dark' ? 'bg-charcoal-light/30 text-white hover:bg-charcoal-light/50' : 'bg-gray-50 text-slate-900 hover:bg-gray-100'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇬🇧</span>
                  <span className="font-semibold">English</span>
                </div>
                {language === 'en' && <span className="material-symbols-outlined">check</span>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Level Details Modal */}
      {showLevelDetails && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowLevelDetails(false)}>
          <div className={`w-full max-w-lg rounded-t-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto animate-slide-up ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-serif ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('profile_levels')}</h2>
              <button onClick={() => setShowLevelDetails(false)} className="text-gray-400 hover:text-white p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {EXPLORER_LEVELS.map((level) => {
                const isCurrentLevel = currentLevel.level === level.level;
                const isUnlocked = points >= level.minPoints;
                return (
                  <div 
                    key={level.level}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isCurrentLevel 
                        ? 'border-primary bg-primary/10' 
                        : isUnlocked 
                          ? theme === 'dark' ? 'border-white/10 bg-charcoal-light/30' : 'border-gray-200 bg-gray-50'
                          : 'border-transparent opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center text-2xl`}>
                        {level.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {t('level')} {level.level} - {level.name}
                          </span>
                          {isCurrentLevel && (
                            <span className="text-[10px] bg-primary text-navy-dark px-2 py-0.5 rounded-full font-bold">{t('current')}</span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {level.minPoints === 0 ? '0' : level.minPoints.toLocaleString()} - {level.maxPoints === Infinity ? '∞' : level.maxPoints.toLocaleString()} {t('points_unit')}
                        </span>
                      </div>
                      {isUnlocked && <span className="material-symbols-outlined text-green-500">check_circle</span>}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {level.benefits.map((benefit, i) => (
                        <span key={i} className={`text-[10px] px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-charcoal-light text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Badges Modal */}
      {showBadges && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowBadges(false)}>
          <div className={`w-full max-w-lg rounded-t-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto animate-slide-up ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-serif ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('badges_title')}</h2>
              <button onClick={() => setShowBadges(false)} className="text-gray-400 hover:text-white p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('badges_unlocked', { count: unlockedBadges.length })}
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {unlockedBadges.map(badge => (
                <div key={badge.id} className={`p-3 rounded-xl text-center ${theme === 'dark' ? 'bg-charcoal-light/30' : 'bg-gray-50'}`}>
                  <div className={`w-14 h-14 mx-auto rounded-xl ${badge.color} flex items-center justify-center text-2xl mb-2`}>
                    {badge.icon}
                  </div>
                  <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{badge.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{badge.description}</p>
                </div>
              ))}
            </div>
            
            {lockedBadges.length > 0 && (
              <>
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('badges_locked', { count: lockedBadges.length })}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {lockedBadges.map(badge => (
                    <div key={badge.id} className={`p-3 rounded-xl text-center opacity-50 ${theme === 'dark' ? 'bg-charcoal-light/30' : 'bg-gray-50'}`}>
                      <div className={`w-14 h-14 mx-auto rounded-xl bg-gray-500 flex items-center justify-center text-2xl mb-2 grayscale`}>
                        {badge.icon}
                      </div>
                      <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{badge.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{badge.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Points History Modal */}
      {showPointsHistory && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowPointsHistory(false)}>
          <div className={`w-full max-w-lg rounded-t-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto animate-slide-up ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-xl font-serif ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('points_title')}</h2>
                <p className="text-primary text-2xl font-bold">{points} {t('points_unit')}</p>
              </div>
              <button onClick={() => setShowPointsHistory(false)} className="text-gray-400 hover:text-white p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className={`p-4 rounded-xl mb-4 ${theme === 'dark' ? 'bg-primary/10 border border-primary/30' : 'bg-yellow-50 border border-yellow-200'}`}>
              <p className="text-sm text-gray-300">
                💡 {t('points_tip')}
              </p>
            </div>
            
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('history')}
            </h3>
            <div className="space-y-2">
              {[...pointsHistory].reverse().map((entry, i) => (
                <div key={i} className={`p-3 rounded-xl flex items-center justify-between ${theme === 'dark' ? 'bg-charcoal-light/30' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">add</span>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{entry.reason}</p>
                      <p className="text-[10px] text-gray-400">{new Date(entry.date).toLocaleDateString(dateLocale)}</p>
                    </div>
                  </div>
                  <span className="text-primary font-bold">+{entry.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trips History Modal */}
      {showTripsHistory && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowTripsHistory(false)}>
          <div className={`w-full max-w-lg rounded-t-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto animate-slide-up ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-xl font-serif ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('trips_title')}</h2>
                <p className="text-gray-400 text-sm">{t('destinations_visited', { count: trips.length })}</p>
              </div>
              <button onClick={() => setShowTripsHistory(false)} className="text-gray-400 hover:text-white p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {trips.map(trip => (
                <div key={trip.id} className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-charcoal-light/30' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center text-3xl">
                      🗺️
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{trip.name}</p>
                      <p className="text-xs text-gray-400">{trip.location}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{new Date(trip.date).toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    {trip.reviewed ? (
                      <span className="text-green-500 text-[10px] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check</span> {t('review_left')}
                      </span>
                    ) : (
                      <button className="text-primary text-xs font-semibold">{t('leave_review')}</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Modal */}
      {showReviews && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowReviews(false)}>
          <div className={`w-full max-w-lg rounded-t-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto animate-slide-up ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-xl font-serif ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('reviews_title')}</h2>
                <p className="text-gray-400 text-sm">{t('reviews_published', { count: reviews.length })}</p>
              </div>
              <button onClick={() => setShowReviews(false)} className="text-gray-400 hover:text-white p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {reviews.map(review => (
                <div key={review.id} className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-charcoal-light/30' : 'bg-gray-50'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{review.locationName}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`material-symbols-outlined text-[16px] ${i < review.rating ? 'text-primary fill-1' : 'text-gray-400'}`}>star</span>
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400">{new Date(review.date).toLocaleDateString(dateLocale)}</span>
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>&quot;{review.comment}&quot;</p>
                  <div className="flex items-center gap-2 mt-2 text-gray-400 text-xs">
                    <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                    {t('people_found_helpful', { count: review.likes })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)}>
          <div className={`w-full max-w-sm rounded-2xl p-6 mx-4 animate-fade-in ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl">logout</span>
              </div>
              <h2 className={`text-xl font-serif mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('logout_confirm')}</h2>
              <p className="text-gray-400 text-sm mb-6">{t('logout_prompt')}</p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${theme === 'dark' ? 'bg-charcoal-light/50 text-white hover:bg-charcoal-light' : 'bg-gray-100 text-slate-900 hover:bg-gray-200'}`}
                >
                  {t('cancel')}
                </button>
                <button className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors">
                  {t('sign_out')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
