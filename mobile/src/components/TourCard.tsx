import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useFavorites, useLanguage } from '../contexts';
import { colors, borderRadius, spacing, fontSize } from '../theme';
import { Tour } from '../constants/data';

interface TourCardProps {
  tour: Tour;
  onPress: () => void;
  onBook?: () => void;
}

export const TourCard: React.FC<TourCardProps> = ({ tour, onPress, onBook }) => {
  const { colors: themeColors } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useLanguage();
  const favorite = isFavorite(tour.id);

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: themeColors.card }]} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: tour.image }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(tour.id)}
        >
          <Ionicons 
            name={favorite ? 'heart' : 'heart-outline'} 
            size={20} 
            color={favorite ? colors.status.error : '#fff'} 
          />
        </TouchableOpacity>
        
        <View style={styles.tagsRow}>
          {tour.tags.map((tag, index) => (
            <View key={index} style={styles.tagBadge}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.name, { color: themeColors.text }]} numberOfLines={1}>
          {tour.name}
        </Text>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={themeColors.textSecondary} />
          <Text style={[styles.location, { color: themeColors.textSecondary }]}>
            {tour.location}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={14} color={colors.primary} />
            <Text style={[styles.infoText, { color: themeColors.textSecondary }]}>
              {tour.duration}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="flag-outline" size={14} color={colors.primary} />
            <Text style={[styles.infoText, { color: themeColors.textSecondary }]}>
              {tour.stops} {t('stops')}
            </Text>
          </View>
          <View style={styles.ratingItem}>
            <Ionicons name="star" size={14} color={colors.primary} />
            <Text style={[styles.rating, { color: themeColors.text }]}>
              {tour.rating}
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View>
            <Text style={[styles.price, { color: colors.primary }]}>
              ${tour.price}
            </Text>
            <Text style={[styles.perPerson, { color: themeColors.textSecondary }]}>
              {t('per_person')}
            </Text>
          </View>
          
          {onBook && (
            <TouchableOpacity style={styles.bookButton} onPress={onBook}>
              <Text style={styles.bookButtonText}>{t('book_now')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  imageContainer: {
    height: 160,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: borderRadius.full,
    padding: spacing.xs,
  },
  tagsRow: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
  },
  tagBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
  },
  tagText: {
    color: '#fff',
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  content: {
    padding: spacing.md,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  location: {
    fontSize: fontSize.sm,
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  infoText: {
    fontSize: fontSize.sm,
    marginLeft: 4,
  },
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  rating: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  price: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  perPerson: {
    fontSize: fontSize.xs,
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});
