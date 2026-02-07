import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useLanguage } from '../contexts';
import { colors, spacing, fontSize, borderRadius } from '../theme';
import { DestinationCard } from '../components';
import { getFeaturedDestinations, Destination } from '../constants/data';

const { width, height } = Dimensions.get('window');

export const HomeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { colors: themeColors } = useTheme();
  const { t } = useLanguage();
  const videoRef = useRef<Video>(null);
  
  const [isMuted, setIsMuted] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const destinations = getFeaturedDestinations();

  const toggleMute = async () => {
    if (videoRef.current) {
      await videoRef.current.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const handleDestinationPress = (destination: Destination) => {
    navigation.navigate('DestinationDetails', { destination });
  };

  const renderDestination = ({ item }: { item: Destination }) => (
    <DestinationCard 
      destination={item} 
      onPress={() => handleDestinationPress(item)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero Video Section */}
        <View style={styles.heroSection}>
          <Video
            ref={videoRef}
            source={{ uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted={isMuted}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(26,20,16,0.9)']}
            style={StyleSheet.absoluteFillObject}
          />
          
          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
            <View>
              <Text style={styles.logo}>GoBénin</Text>
              <Text style={styles.tagline}>{t('discover')}</Text>
            </View>
            <TouchableOpacity 
              style={styles.muteButton}
              onPress={toggleMute}
            >
              <Ionicons 
                name={isMuted ? 'volume-mute' : 'volume-high'} 
                size={20} 
                color="#fff" 
              />
            </TouchableOpacity>
          </View>
          
          {/* Hero Content */}
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{t('welcome_msg')}</Text>
            <Text style={styles.heroSubtitle}>
              Découvrez les merveilles du Bénin
            </Text>
            
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={themeColors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: themeColors.text }]}
                placeholder={t('search_placeholder')}
                placeholderTextColor={themeColors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        </View>
        
        {/* Featured Destinations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              {t('featured')}
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>{t('see_all')}</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={destinations}
            renderItem={renderDestination}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destinationsList}
          />
        </View>
        
        {/* Heritage Sites */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              {t('heritage_sites')}
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>{t('see_all')}</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={destinations.filter(d => d.category === 'History')}
            renderItem={({ item }) => (
              <DestinationCard 
                destination={item} 
                onPress={() => handleDestinationPress(item)}
                variant="small"
              />
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
            <Text style={[styles.actionTitle, { color: themeColors.text }]}>
              {t('discover_circuits')}
            </Text>
            <Ionicons name="arrow-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: themeColors.card }]}
            onPress={() => navigation.navigate('Map')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="map" size={28} color={colors.primary} />
            </View>
            <Text style={[styles.actionTitle, { color: themeColors.text }]}>
              {t('map')}
            </Text>
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
    height: height * 0.55,
    position: 'relative',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
  },
  logo: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: '#fff',
  },
  tagline: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  muteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
  },
  heroTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    color: '#fff',
  },
  heroSubtitle: {
    fontSize: fontSize.lg,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    marginLeft: spacing.sm,
    fontSize: fontSize.md,
  },
  section: {
    paddingTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '500',
  },
  destinationsList: {
    paddingHorizontal: spacing.lg,
  },
  actionsSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
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
  actionTitle: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginLeft: spacing.md,
  },
});
