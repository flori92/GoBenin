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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useLanguage, useAuth } from '../contexts';
import { colors, spacing, fontSize, borderRadius } from '../theme';
import { Header } from '../components';

export const ProfileScreen = ({ navigation }: any) => {
  const { colors: themeColors, theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const { user, signIn, signUp, signOut, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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
        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.userName, { color: themeColors.text }]}>
            {user.email?.split('@')[0]}
          </Text>
          <Text style={[styles.userEmail, { color: themeColors.textSecondary }]}>
            {user.email}
          </Text>
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
    alignItems: 'center',
    padding: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginTop: spacing.md,
  },
  userEmail: {
    fontSize: fontSize.md,
    marginTop: spacing.xs,
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
});
