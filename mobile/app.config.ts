import 'dotenv/config';

export default {
  name: 'GoBenin',
  slug: 'gobenin',
  scheme: 'gobenin',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  splash: {
    backgroundColor: '#0b0b0b',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.gobenin.app',
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#0b0b0b',
    },
    package: 'com.gobenin.app',
  },
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
};
