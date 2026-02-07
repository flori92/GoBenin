import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useLanguage } from './LanguageContext';

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

interface ExplorerLevelDef {
  level: number;
  nameKey: string;
  minPoints: number;
  maxPoints: number;
  icon: string;
  color: string;
  benefitKeys: string[];
}

interface BadgeDef {
  id: string;
  nameKey: string;
  descKey: string;
  icon: string;
  color: string;
  requirement: number;
  type: Badge['type'];
  defaultUnlocked?: boolean;
}

const EXPLORER_LEVEL_DEFS: ExplorerLevelDef[] = [
  { level: 1, nameKey: 'level_1_name', minPoints: 0, maxPoints: 199, icon: '🌱', color: 'from-green-400 to-green-600', benefitKeys: ['level_1_benefit_1'] },
  { level: 2, nameKey: 'level_2_name', minPoints: 200, maxPoints: 499, icon: '🎒', color: 'from-blue-400 to-blue-600', benefitKeys: ['level_2_benefit_1', 'level_2_benefit_2'] },
  { level: 3, nameKey: 'level_3_name', minPoints: 500, maxPoints: 999, icon: '🧭', color: 'from-purple-400 to-purple-600', benefitKeys: ['level_3_benefit_1', 'level_3_benefit_2'] },
  { level: 4, nameKey: 'level_4_name', minPoints: 1000, maxPoints: 1999, icon: '⭐', color: 'from-yellow-400 to-orange-500', benefitKeys: ['level_4_benefit_1', 'level_4_benefit_2'] },
  { level: 5, nameKey: 'level_5_name', minPoints: 2000, maxPoints: Infinity, icon: '👑', color: 'from-primary to-yellow-400', benefitKeys: ['level_5_benefit_1', 'level_5_benefit_2', 'level_5_benefit_3'] },
];

const BADGE_DEFS: BadgeDef[] = [
  { id: 'first-trip', nameKey: 'badge_first_trip_name', descKey: 'badge_first_trip_desc', icon: '👣', color: 'bg-green-500', requirement: 1, type: 'trips' },
  { id: 'explorer-5', nameKey: 'badge_explorer_5_name', descKey: 'badge_explorer_5_desc', icon: '🗺️', color: 'bg-blue-500', requirement: 5, type: 'trips' },
  { id: 'globe-trotter', nameKey: 'badge_globe_trotter_name', descKey: 'badge_globe_trotter_desc', icon: '🌍', color: 'bg-purple-500', requirement: 10, type: 'trips' },
  { id: 'first-review', nameKey: 'badge_first_review_name', descKey: 'badge_first_review_desc', icon: '✍️', color: 'bg-yellow-500', requirement: 1, type: 'reviews' },
  { id: 'reviewer-10', nameKey: 'badge_reviewer_10_name', descKey: 'badge_reviewer_10_desc', icon: '📝', color: 'bg-orange-500', requirement: 10, type: 'reviews' },
  { id: 'reviewer-25', nameKey: 'badge_reviewer_25_name', descKey: 'badge_reviewer_25_desc', icon: '🏆', color: 'bg-red-500', requirement: 25, type: 'reviews' },
  { id: 'points-500', nameKey: 'badge_points_500_name', descKey: 'badge_points_500_desc', icon: '💎', color: 'bg-cyan-500', requirement: 500, type: 'points' },
  { id: 'points-1000', nameKey: 'badge_points_1000_name', descKey: 'badge_points_1000_desc', icon: '💰', color: 'bg-amber-500', requirement: 1000, type: 'points' },
  { id: 'benin-lover', nameKey: 'badge_benin_lover_name', descKey: 'badge_benin_lover_desc', icon: '🇧🇯', color: 'bg-gradient-to-r from-green-500 via-yellow-500 to-red-500', requirement: 0, type: 'special', defaultUnlocked: true },
];

interface UserProgressContextType {
  // Stats
  trips: Trip[];
  reviews: Review[];
  points: number;
  badges: Badge[];
  levels: ExplorerLevel[];
  
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

const buildExplorerLevels = (t: (key: string) => string): ExplorerLevel[] => {
  return EXPLORER_LEVEL_DEFS.map(level => ({
    level: level.level,
    name: t(level.nameKey),
    minPoints: level.minPoints,
    maxPoints: level.maxPoints,
    icon: level.icon,
    color: level.color,
    benefits: level.benefitKeys.map(key => t(key)),
  }));
};

const buildBadges = (t: (key: string) => string, saved?: Badge[]): Badge[] => {
  const base = BADGE_DEFS.map(def => ({
    id: def.id,
    name: t(def.nameKey),
    description: t(def.descKey),
    icon: def.icon,
    color: def.color,
    requirement: def.requirement,
    type: def.type,
    unlocked: Boolean(def.defaultUnlocked),
  }));

  if (!saved) return base;
  const savedMap = new Map(saved.map(badge => [badge.id, badge]));
  const merged = base.map(badge => {
    const existing = savedMap.get(badge.id);
    if (!existing) return badge;
    return {
      ...badge,
      unlocked: existing.unlocked,
      unlockedAt: existing.unlockedAt,
    };
  });

  // Preserve unknown badges if any
  saved.forEach(badge => {
    if (!merged.find(b => b.id === badge.id)) {
      merged.push(badge);
    }
  });

  return merged;
};

const localizeBadges = (t: (key: string) => string, badges: Badge[]) => {
  const defMap = new Map(BADGE_DEFS.map(def => [def.id, def]));
  return badges.map(badge => {
    const def = defMap.get(badge.id);
    if (!def) return badge;
    return {
      ...badge,
      name: t(def.nameKey),
      description: t(def.descKey),
    };
  });
};

const localizeBadge = (t: (key: string) => string, badge: Badge) => {
  const def = BADGE_DEFS.find(d => d.id === badge.id);
  if (!def) return badge;
  return {
    ...badge,
    name: t(def.nameKey),
    description: t(def.descKey),
  };
};

const buildDefaultPointsHistory = (t: (key: string, params?: Record<string, string | number>) => string) => ([
  { amount: 50, reason: t('points_reason_trip', { name: t('default_trip_1_name') }), date: '2024-01-15' },
  { amount: 25, reason: t('points_reason_review', { name: t('default_trip_1_name') }), date: '2024-01-16' },
  { amount: 50, reason: t('points_reason_trip', { name: t('default_trip_2_name') }), date: '2024-02-20' },
  { amount: 25, reason: t('points_reason_review', { name: t('default_trip_2_name') }), date: '2024-02-21' },
  { amount: 50, reason: t('points_reason_trip', { name: t('default_trip_3_name') }), date: '2024-03-10' },
  { amount: 100, reason: t('points_reason_welcome'), date: '2024-01-01' },
  { amount: 500, reason: t('points_reason_premium'), date: '2024-03-15' },
]);

export const UserProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useLanguage();
  const levels = useMemo(() => buildExplorerLevels(t), [t]);

  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('gobenin-trips');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: t('default_trip_1_name'), location: t('default_trip_1_location'), date: '2024-01-15', image: '', reviewed: true },
      { id: '2', name: t('default_trip_2_name'), location: t('default_trip_2_location'), date: '2024-02-20', image: '', reviewed: true },
      { id: '3', name: t('default_trip_3_name'), location: t('default_trip_3_location'), date: '2024-03-10', image: '', reviewed: false },
    ];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('gobenin-reviews');
    return saved ? JSON.parse(saved) : [
      { id: '1', tripId: '1', locationName: t('default_trip_1_name'), rating: 5, comment: t('default_review_1_comment'), date: '2024-01-16', likes: 12 },
      { id: '2', tripId: '2', locationName: t('default_trip_2_name'), rating: 5, comment: t('default_review_2_comment'), date: '2024-02-21', likes: 8 },
    ];
  });

  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem('gobenin-points');
    return saved ? parseInt(saved) : 850;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('gobenin-badges');
    const parsed = saved ? JSON.parse(saved) : undefined;
    return buildBadges(t, parsed);
  });

  const [pointsHistory, setPointsHistory] = useState<{ amount: number; reason: string; date: string }[]>(() => {
    const saved = localStorage.getItem('gobenin-points-history');
    return saved ? JSON.parse(saved) : buildDefaultPointsHistory(t);
  });

  const [recentAchievement, setRecentAchievement] = useState<Badge | null>(null);

  // Refresh localized labels when language changes
  useEffect(() => {
    setBadges(prev => localizeBadges(t, prev));
    setRecentAchievement(prev => (prev ? localizeBadge(t, prev) : prev));
  }, [t]);

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
  const currentLevel = levels.find(
    level => points >= level.minPoints && points <= level.maxPoints
  ) || levels[0];

  const nextLevel = levels.find(l => l.level === currentLevel.level + 1);
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
          const unlocked = { ...badge, unlocked: true, unlockedAt: new Date().toISOString() };
          setRecentAchievement(localizeBadge(t, unlocked));
          return unlocked;
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
    addPoints(POINTS_PER_TRIP, t('points_reason_trip', { name: trip.name }));
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
    addPoints(POINTS_PER_REVIEW, t('points_reason_review', { name: review.locationName }));
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
      levels,
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
