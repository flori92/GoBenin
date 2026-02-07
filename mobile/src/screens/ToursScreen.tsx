import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useLanguage } from '../contexts';
import { colors, spacing, fontSize, borderRadius } from '../theme';
import { Header, TourCard } from '../components';
import { getTours, Tour } from '../constants/data';

type FilterCategory = 'all' | 'history' | 'nature' | 'vodun';

const FILTERS: { id: FilterCategory; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'all', icon: 'apps' },
  { id: 'history', icon: 'business' },
  { id: 'nature', icon: 'leaf' },
  { id: 'vodun', icon: 'eye' },
];

export const ToursScreen = ({ navigation }: any) => {
  const { colors: themeColors } = useTheme();
  const { t } = useLanguage();
  
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  
  const tours = getTours();
  
  const filteredTours = useMemo(() => {
    return tours.filter(tour => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'history') return tour.tags.includes('History');
      if (activeFilter === 'nature') return tour.tags.includes('Nature');
      if (activeFilter === 'vodun') return tour.tags.includes('Cultural');
      return true;
    }).filter(tour => tour.price >= priceRange[0] && tour.price <= priceRange[1]);
  }, [tours, activeFilter, priceRange]);

  const handleTourPress = (tour: Tour) => {
    navigation.navigate('TourDetails', { tour });
  };

  const handleBookTour = (tour: Tour) => {
    navigation.navigate('BookTour', { tour });
  };

  const getFilterLabel = (id: FilterCategory) => {
    switch (id) {
      case 'all': return t('all');
      case 'history': return t('history');
      case 'nature': return t('nature');
      case 'vodun': return t('vodun');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header 
        title={t('tours')}
        rightIcon="options"
        onRightPress={() => {}}
      />
      
      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {FILTERS.map(filter => {
          const isActive = activeFilter === filter.id;
          return (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                { 
                  backgroundColor: isActive ? colors.primary : themeColors.card,
                  borderColor: isActive ? colors.primary : themeColors.border,
                }
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Ionicons 
                name={filter.icon} 
                size={18} 
                color={isActive ? '#fff' : themeColors.textSecondary} 
              />
              <Text style={[
                styles.filterText,
                { color: isActive ? '#fff' : themeColors.text }
              ]}>
                {getFilterLabel(filter.id)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsCount, { color: themeColors.textSecondary }]}>
          {filteredTours.length} circuits trouvés
        </Text>
      </View>
      
      {/* Tours List */}
      <FlatList
        data={filteredTours}
        renderItem={({ item }) => (
          <TourCard 
            tour={item} 
            onPress={() => handleTourPress(item)}
            onBook={() => handleBookTour(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.toursList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="compass-outline" size={64} color={themeColors.textSecondary} />
            <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
              Aucun circuit trouvé
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  filterText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    marginLeft: spacing.xs,
  },
  resultsHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  resultsCount: {
    fontSize: fontSize.sm,
  },
  toursList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: fontSize.lg,
    marginTop: spacing.md,
  },
});
