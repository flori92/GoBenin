import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useLanguage } from '../contexts';
import { colors, spacing, fontSize, borderRadius } from '../theme';
import { Tour } from '../constants/data';

export const BookTourScreen = ({ route, navigation }: any) => {
  const { colors: themeColors } = useTheme();
  const { t } = useLanguage();
  const tour: Tour | undefined = route?.params?.tour;

  if (!tour) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
            Réservation indisponible
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={themeColors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: themeColors.text }]}>{t('book_now')}</Text>
          <View style={styles.backButtonPlaceholder} />
        </View>

        <View style={[styles.summaryCard, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.summaryTitle, { color: themeColors.text }]}>{tour.name}</Text>
          <Text style={[styles.summarySubtitle, { color: themeColors.textSecondary }]}>
            {tour.location}
          </Text>

          <View style={styles.summaryRow}>
            <Ionicons name="time-outline" size={16} color={colors.primary} />
            <Text style={[styles.summaryText, { color: themeColors.textSecondary }]}>
              {tour.duration}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Ionicons name="flag-outline" size={16} color={colors.primary} />
            <Text style={[styles.summaryText, { color: themeColors.textSecondary }]}>
              {tour.stops} {t('stops')}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Ionicons name="pricetag-outline" size={16} color={colors.primary} />
            <Text style={[styles.summaryPrice, { color: colors.primary }]}>
              ${tour.price}
            </Text>
          </View>
        </View>

        <View style={styles.noticeBox}>
          <Text style={[styles.noticeText, { color: themeColors.textSecondary }]}>
            Le paiement et la réservation seront ajoutés dans une prochaine étape.
          </Text>
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={() => navigation.goBack()}>
          <Text style={styles.confirmButtonText}>{t('complete_payment')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  backButtonPlaceholder: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  summaryCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  summarySubtitle: {
    fontSize: fontSize.md,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  summaryText: {
    fontSize: fontSize.sm,
    marginLeft: spacing.sm,
  },
  summaryPrice: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  noticeBox: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: spacing.lg,
  },
  noticeText: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  confirmButtonText: {
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
