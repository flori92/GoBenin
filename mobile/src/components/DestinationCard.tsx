import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, useFavorites } from '../contexts';
import { colors, borderRadius, spacing, fontSize } from '../theme';
import { Destination } from '../constants/data';

interface DestinationCardProps {
  destination: Destination;
  onPress: () => void;
  variant?: 'large' | 'small';
}

const { width } = Dimensions.get('window');
const CARD_WIDTH_LARGE = width * 0.75;
const CARD_WIDTH_SMALL = width * 0.42;

export const DestinationCard: React.FC<DestinationCardProps> = ({ 
  destination, 
  onPress,
  variant = 'large' 
}) => {
  const { colors: themeColors } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(destination.id);
  
  const cardWidth = variant === 'large' ? CARD_WIDTH_LARGE : CARD_WIDTH_SMALL;
  const cardHeight = variant === 'large' ? 220 : 160;

  return (
    <TouchableOpacity 
      style={[styles.card, { width: cardWidth, height: cardHeight }]} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: destination.image }}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
        transition={300}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(destination.id)}
      >
        <Ionicons 
          name={favorite ? 'heart' : 'heart-outline'} 
          size={22} 
          color={favorite ? colors.status.error : '#fff'} 
        />
      </TouchableOpacity>
      
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{destination.category}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{destination.name}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{destination.subtitle}</Text>
        
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color={colors.primary} />
          <Text style={styles.rating}>{destination.rating}</Text>
          <Text style={styles.reviews}>({destination.reviews})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginRight: spacing.md,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: borderRadius.full,
    padding: spacing.xs,
  },
  categoryBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  categoryText: {
    color: '#fff',
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  name: {
    color: '#fff',
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  rating: {
    color: '#fff',
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginLeft: 4,
  },
  reviews: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: fontSize.sm,
    marginLeft: 4,
  },
});
