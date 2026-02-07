import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, useLanguage, useAuth } from '../contexts';
import { colors, spacing, fontSize, borderRadius } from '../theme';
import { Header } from '../components';
import { IMAGES } from '../constants/data';

const { width } = Dimensions.get('window');

const BADGES = [
  { id: 'explorer', icon: 'compass', label: 'Explorer', color: '#3B82F6' },
  { id: 'culture', icon: 'library', label: 'Culture', color: '#8B5CF6' },
  { id: 'nature', icon: 'leaf', label: 'Nature', color: '#10B981' },
  { id: 'history', icon: 'book', label: 'Heritage', color: '#F59E0B' },
];

const PAYMENT_METHODS = [
  { id: 'kkiapay', name: 'KKiaPay', icon: '💳', description: 'Mobile Money & Cards' },
  { id: 'fedapay', name: 'FedaPay', icon: '🏦', description: 'Local Payments' },
];

export const ProfileScreen = ({ navigation }: any) => {
  const { colors: themeColors, theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const { user, signIn, signUp, signOut, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userLevel = 2;
  const userPoints = 1250;
  const userTrips = 5;
  const progressPercent = 65;
  
  const handleAuth = async () => {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = isSignUp 
      ? await signUp(email, password)
      : await signIn(email, password);
    
    if (result.error) {
      setError(result.error.message);
    } else if (isSignUp) {
      Alert.alert('Succès', 'Vérifiez votre email pour confirmer votre compte');
    }
    
    setLoading(false);
  };
  
  const handleSignOut = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: signOut 
        },
      ]
    );
  };

  if (authLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Header title={isSignUp ? t('signup') : t('login')} />
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.authContainer}
        >
          <View style={styles.logoSection}>
            <Text style={styles.logoText}>GoBénin</Text>
            <Text style={[styles.logoSubtext, { color: themeColors.textSecondary }]}>
              {isSignUp ? 'Créez votre compte' : 'Connectez-vous pour continuer'}
            </Text>
          </View>
          
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color={colors.status.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          
          <View style={[styles.inputContainer, { backgroundColor: themeColors.card }]}>
            <Ionicons name="mail-outline" size={20} color={themeColors.textSecondary} />
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              placeholder={t('email')}
              placeholderTextColor={themeColors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          
          <View style={[styles.inputContainer, { backgroundColor: themeColors.card }]}>
            <Ionicons name="lock-closed-outline" size={20} color={themeColors.textSecondary} />
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              placeholder={t('password')}
              placeholderTextColor={themeColors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.authButton, loading && styles.authButtonDisabled]}
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.authButtonText}>
                {isSignUp ? t('signup') : t('login')}
              </Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.switchAuthButton}
            onPress={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
          >
            <Text style={[styles.switchAuthText, { color: themeColors.textSecondary }]}>
              {isSignUp ? t('have_account') : t('no_account')}
            </Text>
            <Text style={styles.switchAuthLink}>
              {isSignUp ? t('login') : t('signup')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header title={t('profile')} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Header with Level */}
        <View style={styles.userSection}>
          <View style={styles.userHeader}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: IMAGES.user }} style={styles.avatarImage} contentFit="cover" />
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>{userLevel}</Text>
              </View>
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: themeColors.text }]}>
                {user.email?.split('@')[0]}
              </Text>
              <Text style={[styles.userEmail, { color: themeColors.textSecondary }]}>
                {user.email}
              </Text>
              <View style={styles.levelTag}>
                <Ionicons name="trophy" size={12} color={colors.primary} />
                <Text style={styles.levelTagText}>{t('level')} {userLevel} - {t('explorer')}</Text>
              </View>
            </View>
          </View>

          {/* Stats Row */}
          <View style={[styles.statsRow, { backgroundColor: themeColors.card }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: themeColors.text }]}>{userPoints}</Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>{t('points')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: themeColors.text }]}>{userTrips}</Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>{t('trips')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: themeColors.text }]}>{BADGES.length}</Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>{t('badges')}</Text>
            </View>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>
            {t('travel_progress')}
          </Text>
          <View style={[styles.progressCard, { backgroundColor: themeColors.card }]}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressLabel, { color: themeColors.text }]}>
                {t('level')} {userLevel} → {t('level')} {userLevel + 1}
              </Text>
              <Text style={[styles.progressPercent, { color: colors.primary }]}>{progressPercent}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={[styles.progressHint, { color: themeColors.textSecondary }]}>
              {750 - (userPoints % 750)} {t('points')} {language === 'fr' ? 'pour le prochain niveau' : 'to next level'}
            </Text>
          </View>
        </View>

        {/* Badges Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>
            {t('badges_earned')}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesRow}>
            {BADGES.map((badge) => (
              <View key={badge.id} style={[styles.badgeCard, { backgroundColor: themeColors.card }]}>
                <View style={[styles.badgeIcon, { backgroundColor: `${badge.color}20` }]}>
                  <Ionicons name={badge.icon as any} size={24} color={badge.color} />
                </View>
                <Text style={[styles.badgeLabel, { color: themeColors.text }]}>{badge.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>
              {t('payment_methods')}
            </Text>
            <TouchableOpacity>
              <Text style={styles.addButton}>{t('add_payment')}</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.settingsCard, { backgroundColor: themeColors.card }]}>
            {PAYMENT_METHODS.map((method, index) => (
              <TouchableOpacity 
                key={method.id}
                style={[styles.paymentItem, index < PAYMENT_METHODS.length - 1 && styles.paymentItemBorder]}
              >
                <Text style={styles.paymentIcon}>{method.icon}</Text>
                <View style={styles.paymentInfo}>
                  <Text style={[styles.paymentName, { color: themeColors.text }]}>{method.name}</Text>
                  <Text style={[styles.paymentDesc, { color: themeColors.textSecondary }]}>{method.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={themeColors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>
            {t('settings')}
          </Text>
          
          <View style={[styles.settingsCard, { backgroundColor: themeColors.card }]}>
            {/* Dark Mode */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                  <Ionicons name="moon" size={20} color="#3B82F6" />
                </View>
                <Text style={[styles.settingLabel, { color: themeColors.text }]}>
                  {t('dark_mode')}
                </Text>
              </View>
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: '#767577', true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
            
            {/* Language */}
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <Ionicons name="language" size={20} color="#10B981" />
                </View>
                <Text style={[styles.settingLabel, { color: themeColors.text }]}>
                  {t('language_label')}
                </Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={[styles.settingValue, { color: themeColors.textSecondary }]}>
                  {language === 'fr' ? 'Français' : 'English'}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={themeColors.textSecondary} />
              </View>
            </TouchableOpacity>
            
            {/* Notifications */}
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                  <Ionicons name="notifications" size={20} color="#F59E0B" />
                </View>
                <Text style={[styles.settingLabel, { color: themeColors.text }]}>
                  {t('notifications')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={themeColors.textSecondary} />
            </TouchableOpacity>

            {/* Help & Support */}
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                  <Ionicons name="help-circle" size={20} color="#8B5CF6" />
                </View>
                <Text style={[styles.settingLabel, { color: themeColors.text }]}>
                  {t('help_support')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={themeColors.textSecondary} />
            </TouchableOpacity>

            {/* Privacy */}
            <TouchableOpacity style={[styles.settingItem, { borderBottomWidth: 0 }]}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(107, 114, 128, 0.15)' }]}>
                  <Ionicons name="shield-checkmark" size={20} color="#6B7280" />
                </View>
                <Text style={[styles.settingLabel, { color: themeColors.text }]}>
                  {t('privacy')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={themeColors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: themeColors.card }]}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.status.error} />
            <Text style={styles.logoutText}>{t('logout')}</Text>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  authContainer: {
    padding: spacing.lg,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoText: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    color: colors.primary,
  },
  logoSubtext: {
    fontSize: fontSize.md,
    marginTop: spacing.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.status.error,
    fontSize: fontSize.sm,
    marginLeft: spacing.sm,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    marginLeft: spacing.sm,
    fontSize: fontSize.md,
  },
  authButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  authButtonDisabled: {
    opacity: 0.7,
  },
  authButtonText: {
    color: '#fff',
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  switchAuthButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  switchAuthText: {
    fontSize: fontSize.md,
  },
  switchAuthLink: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  userSection: {
    padding: spacing.lg,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadgeText: {
    color: '#000',
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  levelTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    gap: 4,
  },
  levelTagText: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  settingsCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: fontSize.md,
    fontWeight: '500',
    marginLeft: spacing.md,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: fontSize.md,
    marginRight: spacing.xs,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  logoutText: {
    color: colors.status.error,
    fontSize: fontSize.md,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  addButton: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  progressCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    fontSize: fontSize.md,
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressHint: {
    fontSize: fontSize.xs,
    marginTop: spacing.sm,
  },
  badgesRow: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  badgeCard: {
    width: 80,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  badgeLabel: {
    fontSize: fontSize.xs,
    fontWeight: '500',
    textAlign: 'center',
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  paymentItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  paymentIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  paymentDesc: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
});
