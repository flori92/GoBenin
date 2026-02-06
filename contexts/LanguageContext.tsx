import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    welcome: "Welcome to Benin",
    explore_soul: "Explore the Soul\nof Africa",
    search_placeholder: "Where do you want to go?",
    featured: "Featured Destinations",
    see_all: "See All",
    heritage_sites: "UNESCO Heritage Sites",
    nearby: "Nearby Activities",
    all: "All",
    food: "Food",
    hotels: "Hotels",
    home: "Home",
    map: "Map",
    tours: "Explore",
    bookings: "Bookings",
    profile: "Profile",
    discover_circuits: "Discover Circuits",
    search_tours: "Search trails, history, locations...",
    my_bookings: "My Bookings",
    upcoming: "Upcoming",
    past: "Past",
    guests: "Guests",
    view_ticket: "View Ticket",
    complete_payment: "Complete Payment",
    looking_for_more: "Looking for more?",
    discover_new: "Discover new heritage sites and circuits in Benin.",
    explore_circuits: "Explore Circuits",
    splash_loading: "Loading...",
    splash_text: "Bénin, a world of splendors",
    price_per_person: "Price per person",
    book_visit: "Book Visit",
    about_dest: "About the destination",
    read_more: "Read more",
    reviews: "Reviews",
    location: "Location",
    explore_map: "Explore Map",
    amenities: "Amenities",
    hours: "Hours",
    duration: "Duration",
    entry: "Entry",
    ticketed: "Ticketed",
    nature: "Nature",
    culture: "Culture",
    history: "Heritage",
    voodoo: "Voodoo",
    view_on_map: "View on Map",
    book_for: "Book for",
    stops: "Stops",
    walk: "Walk",
    small_group: "Small Group",
    included_4x4: "4x4 Included",
    contact_price: "Contact for price",
    payment_pending: "Payment Pending",
    confirmed: "Confirmed",
    reviews_count: "reviews",
    ago: "ago",
    weeks: "weeks",
    day: "Day",
    days: "Days",
    welcome_msg: "Welcome to Benin"
  },
  fr: {
    welcome: "Bienvenue au Bénin",
    explore_soul: "Explorez l'âme\nde l'Afrique",
    search_placeholder: "Où souhaitez-vous aller ?",
    featured: "Destinations en Vedette",
    see_all: "Voir tout",
    heritage_sites: "Sites UNESCO",
    nearby: "Activités à proximité",
    all: "Tout",
    food: "Restauration",
    hotels: "Hôtels",
    home: "Accueil",
    map: "Carte",
    tours: "Explorer",
    bookings: "Réservations",
    profile: "Profil",
    discover_circuits: "Découvrir les Circuits",
    search_tours: "Rechercher pistes, histoire...",
    my_bookings: "Mes Réservations",
    upcoming: "À venir",
    past: "Passé",
    guests: "Invités",
    view_ticket: "Voir le billet",
    complete_payment: "Payer",
    looking_for_more: "Vous en voulez plus ?",
    discover_new: "Découvrez de nouveaux sites et circuits.",
    explore_circuits: "Explorer les Circuits",
    splash_loading: "Chargement...",
    splash_text: "Bénin, un monde de splendeurs",
    price_per_person: "Prix par personne",
    book_visit: "Réserver",
    about_dest: "À propos",
    read_more: "Lire plus",
    reviews: "Avis",
    location: "Lieu",
    explore_map: "Explorer la carte",
    amenities: "Commodités",
    hours: "Horaires",
    duration: "Durée",
    entry: "Entrée",
    ticketed: "Billet requis",
    nature: "Nature",
    culture: "Culture",
    history: "Patrimoine",
    voodoo: "Vaudou",
    view_on_map: "Voir sur la carte",
    book_for: "Réserver pour",
    stops: "Arrêts",
    walk: "Marche",
    small_group: "Petit Groupe",
    included_4x4: "4x4 Inclus",
    contact_price: "Contactez-nous",
    payment_pending: "En attente",
    confirmed: "Confirmé",
    reviews_count: "avis",
    ago: "il y a",
    weeks: "semaines",
    day: "Jour",
    days: "Jours",
    welcome_msg: "Bienvenue au Bénin"
  }
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || key;
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
