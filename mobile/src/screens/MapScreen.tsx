import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useLanguage } from '../contexts';
import { spacing, fontSize, borderRadius } from '../theme';
import { IMAGES } from '../constants/data';

export const MapScreen = ({ navigation }: any) => {
  const { colors: themeColors } = useTheme();
  const { t } = useLanguage();

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={themeColors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: themeColors.text }]}>{t('map')}</Text>
          <View style={styles.backButtonPlaceholder} />
        </View>

        <View style={[styles.mapCard, { backgroundColor: themeColors.card }]}>
          <Image
            source={{ uri: IMAGES.map }}
            style={styles.mapImage}
            contentFit="cover"
            transition={300}
          />
        </View>

        <View style={styles.noticeBox}>
          <Text style={[styles.noticeText, { color: themeColors.textSecondary }]}>
            La carte interactive arrive bientôt. Cette version affiche la carte principale pour
            repérer les zones touristiques.
          </Text>
        </View>
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
  mapCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  mapImage: {
    width: '100%',
    height: 260,
  },
  noticeBox: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  noticeText: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
});
