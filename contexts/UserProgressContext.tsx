import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: number;
  type: 'trips' | 'reviews' | 'points' | 'special';
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Trip {
  id: string;
  name: string;
  location: string;
  date: string;
  image: string;
  rating?: number;
  reviewed: boolean;
}

export interface Review {
  id: string;
  tripId: string;
  locationName: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
}

export interface ExplorerLevel {
  level: number;
  name: string;
  minPoints: number;
  maxPoints: number;
  icon: string;
  color: string;
  benefits: string[];
}

const EXPLORER_LEVELS: ExplorerLevel[] = [
  { level: 1, name: 'Débutant', minPoints: 0, maxPoints: 199, icon: '🌱', color: 'from-green-400 to-green-600', benefits: ['Accès aux circuits de base'] },
  { level: 2, name: 'Aventurier', minPoints: 200, maxPoints: 499, icon: '🎒', color: 'from-blue-400 to-blue-600', benefits: ['5% de réduction', 'Accès prioritaire'] },
  { level: 3, name: 'Explorateur', minPoints: 500, maxPoints: 999, icon: '🧭', color: 'from-purple-400 to-purple-600', benefits: ['10% de réduction', 'Guides exclusifs'] },
  { level: 4, name: 'Pionnier', minPoints: 1000, maxPoints: 1999, icon: '⭐', color: 'from-yellow-400 to-orange-500', benefits: ['15% de réduction', 'Expériences VIP'] },
  { level: 5, name: 'Légende', minPoints: 2000, maxPoints: Infinity, icon: '👑', color: 'from-primary to-yellow-400', benefits: ['20% de réduction', 'Accès illimité', 'Conciergerie'] },
];

const DEFAULT_BADGES: Badge[] = [
  { id: 'first-trip', name: 'Premier Pas', description: 'Effectuer votre premier voyage', icon: '👣', color: 'bg-green-500', requirement: 1, type: 'trips', unlocked: false },
  { id: 'explorer-5', name: 'Explorateur', description: 'Visiter 5 destinations', icon: '🗺️', color: 'bg-blue-500', requirement: 5, type: 'trips', unlocked: false },
  { id: 'globe-trotter', name: 'Globe-Trotter', description: 'Visiter 10 destinations', icon: '🌍', color: 'bg-purple-500', requirement: 10, type: 'trips', unlocked: false },
  { id: 'first-review', name: 'Critique', description: 'Écrire votre premier avis', icon: '✍️', color: 'bg-yellow-500', requirement: 1, type: 'reviews', unlocked: false },
  { id: 'reviewer-10', name: 'Influenceur', description: 'Écrire 10 avis', icon: '📝', color: 'bg-orange-500', requirement: 10, type: 'reviews', unlocked: false },
  { id: 'reviewer-25', name: 'Expert Local', description: 'Écrire 25 avis', icon: '🏆', color: 'bg-red-500', requirement: 25, type: 'reviews', unlocked: false },
  { id: 'points-500', name: 'Collectionneur', description: 'Accumuler 500 points', icon: '💎', color: 'bg-cyan-500', requirement: 500, type: 'points', unlocked: false },
  { id: 'points-1000', name: 'Trésorier', description: 'Accumuler 1000 points', icon: '💰', color: 'bg-amber-500', requirement: 1000, type: 'points', unlocked: false },
  { id: 'benin-lover', name: 'Amoureux du Bénin', description: 'Badge spécial pour les passionnés', icon: '🇧🇯', color: 'bg-gradient-to-r from-green-500 via-yellow-500 to-red-500', requirement: 0, type: 'special', unlocked: true },
];

interface UserProgressContextType {
  // Stats
  trips: Trip[];
  reviews: Review[];
  points: number;
  badges: Badge[];
  
  // Level
  currentLevel: ExplorerLevel;
  progressToNextLevel: number;
  
  // Actions
  addTrip: (trip: Omit<Trip, 'id' | 'reviewed'>) => void;
  addReview: (review: Omit<Review, 'id' | 'date' | 'likes'>) => void;
  addPoints: (amount: number, reason: string) => void;
  
  // Point history
  pointsHistory: { amount: number; reason: string; date: string }[];
  
  // Achievements
  recentAchievement: Badge | null;
  clearRecentAchievement: () => void;
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

const POINTS_PER_TRIP = 50;
const POINTS_PER_REVIEW = 25;
const POINTS_PER_BOOKING = 100;

export const UserProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('gobenin-trips');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Palais Royaux d\'Abomey', location: 'Abomey', date: '2024-01-15', image: '', reviewed: true },
      { id: '2', name: 'Parc Pendjari', location: 'Natitingou', date: '2024-02-20', image: '', reviewed: true },
      { id: '3', name: 'Ouidah', location: 'Ouidah', date: '2024-03-10', image: '', reviewed: false },
    ];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('gobenin-reviews');
    return saved ? JSON.parse(saved) : [
      { id: '1', tripId: '1', locationName: 'Palais Royaux d\'Abomey', rating: 5, comment: 'Incroyable expérience historique!', date: '2024-01-16', likes: 12 },
      { id: '2', tripId: '2', locationName: 'Parc Pendjari', rating: 5, comment: 'Safari magnifique, animaux sauvages au rendez-vous!', date: '2024-02-21', likes: 8 },
    ];
  });

  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem('gobenin-points');
    return saved ? parseInt(saved) : 850;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('gobenin-badges');
    return saved ? JSON.parse(saved) : DEFAULT_BADGES;
  });

  const [pointsHistory, setPointsHistory] = useState<{ amount: number; reason: string; date: string }[]>(() => {
    const saved = localStorage.getItem('gobenin-points-history');
    return saved ? JSON.parse(saved) : [
      { amount: 50, reason: 'Premier voyage - Palais Royaux', date: '2024-01-15' },
      { amount: 25, reason: 'Avis sur Palais Royaux', date: '2024-01-16' },
      { amount: 50, reason: 'Voyage - Parc Pendjari', date: '2024-02-20' },
      { amount: 25, reason: 'Avis sur Parc Pendjari', date: '2024-02-21' },
      { amount: 50, reason: 'Voyage - Ouidah', date: '2024-03-10' },
      { amount: 100, reason: 'Bonus de bienvenue', date: '2024-01-01' },
      { amount: 500, reason: 'Réservation premium', date: '2024-03-15' },
    ];
  });

  const [recentAchievement, setRecentAchievement] = useState<Badge | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('gobenin-trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('gobenin-reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('gobenin-points', points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem('gobenin-badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('gobenin-points-history', JSON.stringify(pointsHistory));
  }, [pointsHistory]);

  // Calculate current level
  const currentLevel = EXPLORER_LEVELS.find(
    level => points >= level.minPoints && points <= level.maxPoints
  ) || EXPLORER_LEVELS[0];

  const nextLevel = EXPLORER_LEVELS.find(l => l.level === currentLevel.level + 1);
  const progressToNextLevel = nextLevel 
    ? ((points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  // Check and unlock badges
  const checkBadges = (newTrips: number, newReviews: number, newPoints: number) => {
    setBadges(prev => {
      const updated = prev.map(badge => {
        if (badge.unlocked) return badge;
        
        let shouldUnlock = false;
        if (badge.type === 'trips' && newTrips >= badge.requirement) shouldUnlock = true;
        if (badge.type === 'reviews' && newReviews >= badge.requirement) shouldUnlock = true;
        if (badge.type === 'points' && newPoints >= badge.requirement) shouldUnlock = true;
        
        if (shouldUnlock) {
          setRecentAchievement({ ...badge, unlocked: true, unlockedAt: new Date().toISOString() });
          return { ...badge, unlocked: true, unlockedAt: new Date().toISOString() };
        }
        return badge;
      });
      return updated;
    });
  };

  const addTrip = (trip: Omit<Trip, 'id' | 'reviewed'>) => {
    const newTrip: Trip = {
      ...trip,
      id: Date.now().toString(),
      reviewed: false,
    };
    setTrips(prev => {
      const updated = [...prev, newTrip];
      checkBadges(updated.length, reviews.length, points + POINTS_PER_TRIP);
      return updated;
    });
    addPoints(POINTS_PER_TRIP, `Voyage - ${trip.name}`);
  };

  const addReview = (review: Omit<Review, 'id' | 'date' | 'likes'>) => {
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      likes: 0,
    };
    setReviews(prev => {
      const updated = [...prev, newReview];
      checkBadges(trips.length, updated.length, points + POINTS_PER_REVIEW);
      return updated;
    });
    setTrips(prev => prev.map(t => t.id === review.tripId ? { ...t, reviewed: true } : t));
    addPoints(POINTS_PER_REVIEW, `Avis sur ${review.locationName}`);
  };

  const addPoints = (amount: number, reason: string) => {
    setPoints(prev => {
      const newTotal = prev + amount;
      checkBadges(trips.length, reviews.length, newTotal);
      return newTotal;
    });
    setPointsHistory(prev => [...prev, { amount, reason, date: new Date().toISOString() }]);
  };

  const clearRecentAchievement = () => setRecentAchievement(null);

  return (
    <UserProgressContext.Provider value={{
      trips,
      reviews,
      points,
      badges,
      currentLevel,
      progressToNextLevel,
      addTrip,
      addReview,
      addPoints,
      pointsHistory,
      recentAchievement,
      clearRecentAchievement,
    }}>
      {children}
    </UserProgressContext.Provider>
  );
};

export const useUserProgress = () => {
  const context = useContext(UserProgressContext);
  if (!context) {
    throw new Error('useUserProgress must be used within a UserProgressProvider');
  }
  return context;
};

export { EXPLORER_LEVELS };
