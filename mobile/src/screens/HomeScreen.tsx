import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ImageBackground,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useLanguage, useFavorites } from '../contexts';
import { colors, spacing, fontSize, borderRadius } from '../theme';
import { DestinationCard } from '../components';
import { getFeaturedDestinations, getHeritageSites, getNearbyActivities, Destination, IMAGES } from '../constants/data';

const { width, height } = Dimensions.get('window');

export const HomeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { colors: themeColors, theme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [nearbyFilter, setNearbyFilter] = useState<'all' | 'Food' | 'Hotel'>('all');
  
  const featured = getFeaturedDestinations();
  const heritage = getHeritageSites();
  const nearby = getNearbyActivities();

  const filteredNearby = useMemo(() => {
    if (nearbyFilter === 'all') return nearby;
    return nearby.filter(activity => activity.category === nearbyFilter);
  }, [nearby, nearbyFilter]);

  const allLocations = useMemo(() => [...featured, ...heritage, ...nearby], [featured, heritage, nearby]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allLocations.filter(loc => 
      loc.name.toLowerCase().includes(query) ||
      loc.subtitle?.toLowerCase().includes(query) ||
      loc.description?.toLowerCase().includes(query)
    );
  }, [searchQuery, allLocations]);

  const handleDestinationPress = (destination: Destination) => {
    navigation.navigate('DestinationDetails', { destination });
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setShowSearchResults(text.length > 0);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero Image Section */}
        <ImageBackground
          source={{ uri: IMAGES.hero }}
          style={styles.heroSection}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'rgba(26,20,16,0.95)']}
            style={StyleSheet.absoluteFillObject}
          />
          
          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
            <View style={styles.welcomeTag}>
              <View style={styles.welcomeTagLine} />
              <Text style={styles.welcomeTagText}>{t('welcome_msg')}</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity 
                style={styles.langButton}
                onPress={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              >
                <Text style={styles.langButtonText}>{language === 'en' ? 'FR' : 'EN'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.notifButton}>
                <Ionicons name="notifications-outline" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Hero Content - empty space for visual */}
          <View style={styles.heroSpacer} />
        </ImageBackground>

        {/* Floating Search Bar */}
        <View style={styles.searchWrapper}>
          <View style={[styles.searchContainer, { backgroundColor: themeColors.card }]}>
            <Ionicons name="search" size={20} color={colors.primary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: themeColors.text }]}
              placeholder={t('search_placeholder')}
              placeholderTextColor={themeColors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => { setSearchQuery(''); setShowSearchResults(false); }}>
                <Ionicons name="close" size={18} color={themeColors.textSecondary} />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options" size={20} color={colors.dark.background} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.mapButton}
              onPress={() => navigation.navigate('Map')}
            >
              <Ionicons name="map" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Search Results */}
          {showSearchResults && (
            <View style={[styles.searchResults, { backgroundColor: themeColors.card }]}>
              {searchResults.length > 0 ? (
                <>
                  <Text style={[styles.searchResultsCount, { color: themeColors.textSecondary }]}>
                    {t('results', { count: searchResults.length })}
                  </Text>
                  {searchResults.slice(0, 5).map((result) => (
                    <TouchableOpacity
                      key={result.id}
                      style={styles.searchResultItem}
                      onPress={() => {
                        setSearchQuery('');
                        setShowSearchResults(false);
                        handleDestinationPress(result);
                      }}
                    >
                      <Image source={{ uri: result.image }} style={styles.searchResultImage} />
                      <View style={styles.searchResultInfo}>
                        <Text style={[styles.searchResultName, { color: themeColors.text }]}>{result.name}</Text>
                        <Text style={[styles.searchResultSubtitle, { color: themeColors.textSecondary }]}>{result.subtitle}</Text>
                      </View>
                      <View style={styles.searchResultRating}>
                        <Ionicons name="star" size={12} color={colors.primary} />
                        <Text style={styles.searchResultRatingText}>{result.rating}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              ) : (
                <View style={styles.noResults}>
                  <Ionicons name="search-outline" size={40} color={themeColors.textSecondary} />
                  <Text style={[styles.noResultsText, { color: themeColors.textSecondary }]}>{t('no_results')}</Text>
                </View>
              )}
            </View>
          )}
        </View>
        
        {/* Featured Destinations - Curated Journeys */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                {t('curated_journeys')}
              </Text>
              <Text style={[styles.sectionSubtitle, { color: themeColors.textSecondary }]}>
                {t('curated_journeys_desc')}
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Tours')}>
              <Text style={styles.seeAll}>{t('see_all')}</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={featured}
            renderItem={({ item }) => (
              <DestinationCard 
                destination={item} 
                onPress={() => handleDestinationPress(item)}
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destinationsList}
          />
        </View>
        
        {/* Heritage Sites */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                {t('heritage_sites')}
              </Text>
              <Text style={[styles.sectionSubtitle, { color: themeColors.textSecondary }]}>
                {t('heritage_sites_desc')}
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAll}>{t('see_all')}</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={heritage}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.heritageCard, { backgroundColor: themeColors.card }]}
                onPress={() => handleDestinationPress(item)}
              >
                <Image source={{ uri: item.image }} style={styles.heritageImage} contentFit="cover" />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.heritageGradient}
                />
                <View style={styles.heritageContent}>
                  <Text style={styles.heritageName}>{item.name}</Text>
                  <Text style={styles.heritageSubtitle}>{item.subtitle}</Text>
                  <View style={styles.heritageRating}>
                    <Ionicons name="star" size={12} color={colors.primary} />
                    <Text style={styles.heritageRatingText}>{item.rating}</Text>
                    <Text style={styles.heritageReviews}>({item.reviews})</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.heritageFavorite}
                  onPress={() => toggleFavorite(item.id)}
                >
                  <Ionicons 
                    name={isFavorite(item.id) ? 'heart' : 'heart-outline'} 
                    size={18} 
                    color={isFavorite(item.id) ? colors.status.error : '#fff'} 
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destinationsList}
          />
        </View>
        
        {/* Nearby Activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                {t('nearby')}
              </Text>
              <Text style={[styles.sectionSubtitle, { color: themeColors.textSecondary }]}>
                {t('nearby_desc')}
              </Text>
            </View>
          </View>
          
          {/* Filter Tabs */}
          <View style={styles.filterTabs}>
            {(['all', 'Food', 'Hotel'] as const).map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterTab,
                  nearbyFilter === filter && styles.filterTabActive,
                  { backgroundColor: nearbyFilter === filter ? colors.primary : themeColors.card }
                ]}
                onPress={() => setNearbyFilter(filter)}
              >
                <Ionicons 
                  name={filter === 'all' ? 'apps' : filter === 'Food' ? 'restaurant' : 'bed'} 
                  size={16} 
                  color={nearbyFilter === filter ? '#000' : themeColors.textSecondary} 
                />
                <Text style={[
                  styles.filterTabText,
                  { color: nearbyFilter === filter ? '#000' : themeColors.textSecondary }
                ]}>
                  {filter === 'all' ? t('all') : filter === 'Food' ? t('food') : t('hotels')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <FlatList
            data={filteredNearby}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.nearbyCard, { backgroundColor: themeColors.card }]}
                onPress={() => handleDestinationPress(item)}
              >
                <Image source={{ uri: item.image }} style={styles.nearbyImage} contentFit="cover" />
                <View style={styles.nearbyContent}>
                  <Text style={[styles.nearbyName, { color: themeColors.text }]} numberOfLines={1}>{item.name}</Text>
                  <Text style={[styles.nearbySubtitle, { color: themeColors.textSecondary }]} numberOfLines={1}>{item.subtitle}</Text>
                  <View style={styles.nearbyRating}>
                    <Ionicons name="star" size={12} color={colors.primary} />
                    <Text style={[styles.nearbyRatingText, { color: themeColors.text }]}>{item.rating}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destinationsList}
          />
        </View>
        
        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: themeColors.card }]}
            onPress={() => navigation.navigate('Tours')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="compass" size={28} color={colors.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: themeColors.text }]}>
                {t('discover_circuits')}
              </Text>
              <Text style={[styles.actionSubtitle, { color: themeColors.textSecondary }]}>
                {t('discover_circuits_desc')}
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: themeColors.card }]}
            onPress={() => navigation.navigate('Map')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="map" size={28} color={colors.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: themeColors.text }]}>
                {t('explore_map')}
              </Text>
              <Text style={[styles.actionSubtitle, { color: themeColors.textSecondary }]}>
                {t('explore_map_desc')}
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    height: height * 0.4,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
  },
  welcomeTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeTagLine: {
    width: 3,
    height: 16,
    backgroundColor: colors.primary,
    marginRight: spacing.sm,
    borderRadius: 2,
  },
  welcomeTagText: {
    fontSize: fontSize.sm,
    color: '#fff',
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  langButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.sm,
  },
  langButtonText: {
    color: '#fff',
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  notifButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSpacer: {
    flex: 1,
  },
  searchWrapper: {
    marginTop: -spacing.xl,
    paddingHorizontal: spacing.lg,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  mapButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  searchResults: {
    marginTop: spacing.sm,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    maxHeight: 300,
  },
  searchResultsCount: {
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  searchResultImage: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
  },
  searchResultInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  searchResultName: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  searchResultSubtitle: {
    fontSize: fontSize.sm,
  },
  searchResultRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  searchResultRatingText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 2,
  },
  noResults: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  noResultsText: {
    marginTop: spacing.sm,
    fontSize: fontSize.md,
  },
  section: {
    paddingTop: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  seeAll: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '500',
  },
  destinationsList: {
    paddingHorizontal: spacing.lg,
  },
  heritageCard: {
    width: width * 0.65,
    height: 180,
    borderRadius: borderRadius.lg,
    marginRight: spacing.md,
    overflow: 'hidden',
    position: 'relative',
  },
  heritageImage: {
    width: '100%',
    height: '100%',
  },
  heritageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  heritageContent: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
  },
  heritageName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: '#fff',
  },
  heritageSubtitle: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  heritageRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  heritageRatingText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 2,
  },
  heritageReviews: {
    fontSize: fontSize.xs,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 4,
  },
  heritageFavorite: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  filterTabActive: {},
  filterTabText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  nearbyCard: {
    width: 140,
    borderRadius: borderRadius.lg,
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  nearbyImage: {
    width: '100%',
    height: 100,
  },
  nearbyContent: {
    padding: spacing.sm,
  },
  nearbyName: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  nearbySubtitle: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  nearbyRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  nearbyRatingText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    marginLeft: 2,
  },
  actionsSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  actionTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  actionSubtitle: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
});
