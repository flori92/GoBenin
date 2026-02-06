import React, { useState } from 'react';
import { IMAGES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'kkiapay' | 'fedapay' | 'card' | 'mobile';
  icon: string;
  color: string;
  details?: string;
  isDefault?: boolean;
}

export const Profile: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: '1', name: 'KKiaPay', type: 'kkiapay', icon: '💳', color: 'bg-blue-500', details: 'Mobile Money & Cards', isDefault: true },
    { id: '2', name: 'FedaPay', type: 'fedapay', icon: '🏦', color: 'bg-green-500', details: 'MTN, Moov, Cards' },
  ]);

  const [userInfo, setUserInfo] = useState({
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@email.com',
    phone: '+229 97 00 00 00',
    country: 'Bénin'
  });

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
      details: type === 'kkiapay' ? 'Mobile Money & Cards' : 'MTN, Moov, Cards',
    };
    setPaymentMethods(prev => [...prev, newMethod]);
  };

  return (
    <div className={`flex flex-col h-full pb-24 overflow-y-auto transition-colors duration-300 ${theme === 'dark' ? 'bg-background-dark' : 'bg-gray-50'}`}>
      {/* Header Profile Card */}
      <div className={`relative pb-8 rounded-b-[2.5rem] shadow-lg z-10 ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`}>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-b-[2.5rem]"></div>
        <div className="flex flex-col items-center pt-16 px-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-primary/30 shadow-glow bg-cover bg-center" style={{ backgroundImage: `url('${IMAGES.user}')` }}></div>
            <button className="absolute bottom-1 right-1 bg-primary text-navy-dark p-2 rounded-full shadow-lg hover:bg-primary-light transition-colors">
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>
          <h1 className={`text-2xl font-serif font-bold mt-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{userInfo.name}</h1>
          <p className="text-gray-400 text-sm">Explorer Level 3 • Benin Lover</p>
          
          <div className="flex gap-6 mt-6 w-full justify-center">
            <div className="flex flex-col items-center">
              <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>12</span>
              <span className="text-xs text-gray-400 uppercase tracking-wide">Trips</span>
            </div>
            <div className={`w-px h-8 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className="flex flex-col items-center">
              <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>45</span>
              <span className="text-xs text-gray-400 uppercase tracking-wide">Reviews</span>
            </div>
            <div className={`w-px h-8 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className="flex flex-col items-center">
              <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>850</span>
              <span className="text-xs text-gray-400 uppercase tracking-wide">Points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="px-6 py-6 flex flex-col gap-6">
        
        {/* Account Section */}
        <section>
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Compte</h3>
          <div className={`rounded-2xl p-2 shadow-lg ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`}>
            <button 
              onClick={() => setShowPersonalInfo(true)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Informations personnelles</span>
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
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Méthodes de paiement</span>
                  <span className="text-xs text-gray-400">KKiaPay, FedaPay</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Preferences Section */}
        <section>
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Préférences</h3>
          <div className={`rounded-2xl p-2 shadow-lg ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`}>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">notifications</span>
                </div>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Notifications</span>
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
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Mode {theme === 'dark' ? 'sombre' : 'clair'}</span>
                  <span className="text-xs text-gray-400">{theme === 'dark' ? 'Thème luxueux activé' : 'Thème clair activé'}</span>
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
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Langue</span>
                  <span className="text-xs text-gray-400">{language === 'fr' ? 'Français' : 'English'}</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Support Section */}
        <section>
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Support</h3>
          <div className={`rounded-2xl p-2 shadow-lg ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`}>
            <button className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">help</span>
                </div>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Aide & FAQ</span>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </button>
            <div className={`h-px mx-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
            <button className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Nous contacter</span>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </button>
          </div>
        </section>

        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${theme === 'dark' ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
        >
          <span className="material-symbols-outlined">logout</span> Déconnexion
        </button>
      </div>

      {/* Personal Info Modal */}
      {showPersonalInfo && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowPersonalInfo(false)}>
          <div className={`w-full max-w-lg rounded-t-3xl p-6 pb-10 max-h-[80vh] overflow-y-auto animate-slide-up ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-serif ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Informations personnelles</h2>
              <button onClick={() => setShowPersonalInfo(false)} className="text-gray-400 hover:text-white p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            {Object.entries(userInfo).map(([key, value]) => (
              <div key={key} className={`p-4 rounded-xl mb-3 ${theme === 'dark' ? 'bg-charcoal-light/30' : 'bg-gray-50'}`}>
                <label className="text-xs text-gray-400 uppercase tracking-wide">
                  {key === 'name' ? 'Nom complet' : key === 'email' ? 'Email' : key === 'phone' ? 'Téléphone' : 'Pays'}
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
                    <button onClick={() => handleEditField(key, value)} className="text-primary">
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
              <h2 className={`text-xl font-serif ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Méthodes de paiement</h2>
              <button onClick={() => setShowPaymentMethods(false)} className="text-gray-400 hover:text-white p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Payment Aggregators Info */}
            <div className={`p-4 rounded-xl mb-4 border ${theme === 'dark' ? 'bg-primary/10 border-primary/30' : 'bg-blue-50 border-blue-200'}`}>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                🇧🇯 Paiements sécurisés via des agrégateurs locaux : <strong className="text-primary">KKiaPay</strong> et <strong className="text-green-500">FedaPay</strong> - Mobile Money (MTN, Moov) et cartes bancaires.
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
                          <span className="text-[10px] bg-primary text-navy-dark px-2 py-0.5 rounded-full font-bold">PAR DÉFAUT</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{pm.details}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!pm.isDefault && (
                      <button 
                        onClick={() => handleSetDefaultPayment(pm.id)}
                        className="text-primary text-xs font-semibold hover:underline"
                      >
                        Définir par défaut
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
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Ajouter une méthode</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleAddPaymentMethod('kkiapay')}
                className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all border-2 border-dashed ${theme === 'dark' ? 'border-blue-500/50 hover:border-blue-500 hover:bg-blue-500/10' : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'}`}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white text-2xl">💳</div>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>KKiaPay</span>
                <span className="text-[10px] text-gray-400 text-center">Mobile Money & Cartes</span>
              </button>
              <button 
                onClick={() => handleAddPaymentMethod('fedapay')}
                className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all border-2 border-dashed ${theme === 'dark' ? 'border-green-500/50 hover:border-green-500 hover:bg-green-500/10' : 'border-green-300 hover:border-green-500 hover:bg-green-50'}`}
              >
                <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-white text-2xl">🏦</div>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>FedaPay</span>
                <span className="text-[10px] text-gray-400 text-center">MTN, Moov, Cartes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowLanguageModal(false)}>
          <div className={`w-full max-w-sm rounded-2xl p-6 mx-4 animate-fade-in ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <h2 className={`text-xl font-serif mb-4 text-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Choisir la langue</h2>
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

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)}>
          <div className={`w-full max-w-sm rounded-2xl p-6 mx-4 animate-fade-in ${theme === 'dark' ? 'bg-charcoal-card' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl">logout</span>
              </div>
              <h2 className={`text-xl font-serif mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Déconnexion</h2>
              <p className="text-gray-400 text-sm mb-6">Êtes-vous sûr de vouloir vous déconnecter ?</p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${theme === 'dark' ? 'bg-charcoal-light/50 text-white hover:bg-charcoal-light' : 'bg-gray-100 text-slate-900 hover:bg-gray-200'}`}
                >
                  Annuler
                </button>
                <button className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors">
                  Déconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
