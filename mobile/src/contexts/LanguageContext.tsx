import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations: Record<Language, Record<string, string | { one: string; other: string }>> = {
  en: {
    welcome_msg: "Welcome to Benin",
    discover: "Discover",
    featured: "Featured Destinations",
    curated_journeys: "Curated Journeys",
    curated_journeys_desc: "Handpicked experiences for unforgettable memories",
    heritage_sites: "Heritage Sites",
    heritage_sites_desc: "UNESCO World Heritage and historical landmarks",
    nearby: "Nearby Experiences",
    nearby_desc: "Discover what's around you",
    search_placeholder: "Search destinations, tours...",
    home: "Home",
    tours: "Tours",
    map: "Map",
    bookings: "Bookings",
    profile: "Profile",
    discover_circuits: "Discover Circuits",
    discover_circuits_desc: "Explore guided tours across Benin",
    explore_map: "Explore Map",
    explore_map_desc: "Find places near you",
    my_bookings: "My Bookings",
    upcoming: "Upcoming",
    past: "Past",
    guests: "Guests",
    view_ticket: "View Ticket",
    complete_payment: "Complete Payment",
    no_bookings: "No bookings found",
    explore_circuits: "Explore Circuits",
    all: "All",
    food: "Food",
    hotels: "Hotels",
    history: "Heritage",
    nature: "Nature",
    vodun: "Vodun",
    filters: "Filters",
    price: "Price",
    rating_label: "Rating",
    distance: "Distance",
    apply_filters: "Apply Filters",
    book_now: "Book Now",
    view_details: "View Details",
    about_dest: "About",
    reviews: "Reviews",
    location: "Location",
    duration: "Duration",
    stops: "Stops",
    included: "What's Included",
    logout: "Sign Out",
    settings: "Settings",
    notifications: "Notifications",
    dark_mode: "Dark Mode",
    language_label: "Language",
    login: "Sign In",
    signup: "Sign Up",
    email: "Email",
    password: "Password",
    forgot_password: "Forgot Password?",
    no_account: "Don't have an account?",
    have_account: "Already have an account?",
    guests_people: { one: "{count} person", other: "{count} people" },
    per_person: "per person",
    total: "Total",
    confirm_booking: "Confirm Booking",
    booking_success: "Booking Confirmed!",
    see_all: "See all",
    results: { one: "{count} result", other: "{count} results" },
    no_results: "No results found",
    level: "Level",
    explorer: "Explorer",
    points: "Points",
    trips: "Trips",
    badges: "Badges",
    travel_progress: "Travel Progress",
    badges_earned: "Badges Earned",
    payment_methods: "Payment Methods",
    add_payment: "Add Payment",
    account: "Account",
    help_support: "Help & Support",
    about: "About",
    privacy: "Privacy Policy",
  },
  fr: {
    welcome_msg: "Bienvenue au Bénin",
    discover: "Découvrir",
    featured: "Destinations Vedettes",
    curated_journeys: "Voyages Sélectionnés",
    curated_journeys_desc: "Expériences triées sur le volet pour des souvenirs inoubliables",
    heritage_sites: "Sites Patrimoniaux",
    heritage_sites_desc: "Patrimoine mondial UNESCO et sites historiques",
    nearby: "À Proximité",
    nearby_desc: "Découvrez ce qui vous entoure",
    search_placeholder: "Rechercher destinations, circuits...",
    home: "Accueil",
    tours: "Circuits",
    map: "Carte",
    bookings: "Réservations",
    profile: "Profil",
    discover_circuits: "Découvrir les Circuits",
    discover_circuits_desc: "Explorez les circuits guidés au Bénin",
    explore_map: "Explorer la Carte",
    explore_map_desc: "Trouvez des lieux près de vous",
    my_bookings: "Mes Réservations",
    upcoming: "À venir",
    past: "Passé",
    guests: "Invités",
    view_ticket: "Voir le Billet",
    complete_payment: "Payer",
    no_bookings: "Aucune réservation",
    explore_circuits: "Explorer les Circuits",
    all: "Tous",
    food: "Cuisine",
    hotels: "Hôtels",
    history: "Patrimoine",
    nature: "Nature",
    vodun: "Vodun",
    filters: "Filtres",
    price: "Prix",
    rating_label: "Note",
    distance: "Distance",
    apply_filters: "Appliquer",
    book_now: "Réserver",
    view_details: "Voir Détails",
    about_dest: "À propos",
    reviews: "Avis",
    location: "Lieu",
    duration: "Durée",
    stops: "Étapes",
    included: "Inclus",
    logout: "Déconnexion",
    settings: "Paramètres",
    notifications: "Notifications",
    dark_mode: "Mode Sombre",
    language_label: "Langue",
    login: "Connexion",
    signup: "Inscription",
    email: "Email",
    password: "Mot de passe",
    forgot_password: "Mot de passe oublié ?",
    no_account: "Pas de compte ?",
    have_account: "Déjà un compte ?",
    guests_people: { one: "{count} personne", other: "{count} personnes" },
    per_person: "par personne",
    total: "Total",
    confirm_booking: "Confirmer",
    booking_success: "Réservation Confirmée !",
    see_all: "Voir tout",
    results: { one: "{count} résultat", other: "{count} résultats" },
    no_results: "Aucun résultat trouvé",
    level: "Niveau",
    explorer: "Explorateur",
    points: "Points",
    trips: "Voyages",
    badges: "Badges",
    travel_progress: "Progression Voyage",
    badges_earned: "Badges Obtenus",
    payment_methods: "Moyens de Paiement",
    add_payment: "Ajouter un Paiement",
    account: "Compte",
    help_support: "Aide & Support",
    about: "À propos",
    privacy: "Politique de Confidentialité",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'gobenin-language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(saved => {
      if (saved === 'en' || saved === 'fr') {
        setLanguageState(saved);
      }
    });
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem(STORAGE_KEY, lang);
  };

  const pluralRules = useMemo(() => {
    const locale = language === 'fr' ? 'fr-FR' : 'en-US';
    if (Intl && typeof Intl.PluralRules === 'function') {
      return new Intl.PluralRules(locale);
    }
    // Fallback for runtimes without Intl.PluralRules (some React Native builds)
    return {
      select: (count: number) => {
        if (language === 'fr') {
          return count <= 1 ? 'one' : 'other';
        }
        return count === 1 ? 'one' : 'other';
      },
    } as Intl.PluralRules;
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>) => {
    const entry = translations[language][key];
    if (!entry) return key;
    
    const text = typeof entry === 'string'
      ? entry
      : (() => {
          const count = typeof params?.count === 'number' ? params.count : 0;
          const rule = pluralRules.select(count);
          return entry[rule as 'one' | 'other'] || entry.other;
        })();
    
    if (!params) return text;
    return Object.entries(params).reduce((acc, [paramKey, value]) => {
      return acc.replace(`{${paramKey}}`, String(value));
    }, text);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
