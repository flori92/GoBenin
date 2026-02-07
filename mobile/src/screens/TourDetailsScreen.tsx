import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useLanguage } from '../contexts';
import { colors, spacing, fontSize, borderRadius } from '../theme';
import { Tour } from '../constants/data';

export const TourDetailsScreen = ({ route, navigation }: any) => {
  const { colors: themeColors } = useTheme();
  const { t } = useLanguage();
  const tour: Tour | undefined = route?.params?.tour;

  if (!tour) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
            Circuit introuvable
          </Text>
          <TouchableOpacity style={styles.backAction} onPress={() => navigation.goBack()}>
            <Text style={styles.backActionText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image
            source={{ uri: tour.image }}
            style={styles.heroImage}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.85)']}
            style={StyleSheet.absoluteFillObject}
          />

          <View style={styles.heroHeader}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.heroContent}>
            <View style={styles.tagsRow}>
              {tour.tags.map((tag, index) => (
                <View key={`${tag}-${index}`} style={styles.tagBadge}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.name}>{tour.name}</Text>
            <Text style={styles.subtitle}>{tour.location}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color={colors.primary} />
              <Text style={styles.ratingText}>{tour.rating}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Aperçu</Text>
          <Text style={[styles.description, { color: themeColors.textSecondary }]}>
            {tour.description}
          </Text>
        </View>

        <View style={styles.infoGrid}>
          <View style={[styles.infoCard, { backgroundColor: themeColors.card }]}>
            <Ionicons name="time-outline" size={18} color={colors.primary} />
            <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
              {t('duration')}
            </Text>
            <Text style={[styles.infoValue, { color: themeColors.text }]}>{tour.duration}</Text>
          </View>
          <View style={[styles.infoCard, { backgroundColor: themeColors.card }]}>
            <Ionicons name="flag-outline" size={18} color={colors.primary} />
            <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
              {t('stops')}
            </Text>
            <Text style={[styles.infoValue, { color: themeColors.text }]}>{tour.stops}</Text>
          </View>
          <View style={[styles.infoCard, { backgroundColor: themeColors.card }]}>
            <Ionicons name="map-outline" size={18} color={colors.primary} />
            <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
              {t('distance')}
            </Text>
            <Text style={[styles.infoValue, { color: themeColors.text }]}>{tour.distance}</Text>
          </View>
          <View style={[styles.infoCard, { backgroundColor: themeColors.card }]}>
            <Ionicons name="pricetag-outline" size={18} color={colors.primary} />
            <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
              {t('price')}
            </Text>
            <Text style={[styles.infoValue, { color: themeColors.text }]}>${tour.price}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Étapes</Text>
          {tour.stopNames.map((stop, index) => (
            <View key={`${stop}-${index}`} style={styles.stopRow}>
              <View style={styles.stopDot} />
              <Text style={[styles.stopText, { color: themeColors.text }]}>{stop}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => navigation.navigate('BookTour', { tour })}
          >
            <Text style={styles.bookButtonText}>{t('book_now')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    height: 320,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroHeader: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  tagBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  tagText: {
    color: '#fff',
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  name: {
    color: '#fff',
    fontSize: fontSize.xxl,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: fontSize.md,
    marginTop: spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  ratingText: {
    color: '#fff',
    fontSize: fontSize.md,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  infoCard: {
    width: '48%',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  infoLabel: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  infoValue: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  stopDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: spacing.sm,
  },
  stopText: {
    fontSize: fontSize.md,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  backAction: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  backActionText: {
    color: '#fff',
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});
