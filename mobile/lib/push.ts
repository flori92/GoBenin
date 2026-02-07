import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from './supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotificationsAsync = async () => {
  if (!Device.isDevice) {
    throw new Error('Push notifications require a physical device');
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    throw new Error('Permission not granted');
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#EAA62B',
    });
  }

  return token;
};

export const upsertPushToken = async (userId: string, token: string) => {
  const { error } = await supabase
    .from('push_tokens')
    .upsert({
      user_id: userId,
      token,
      provider: 'expo',
      platform: Platform.OS,
      enabled: true,
      last_seen_at: new Date().toISOString(),
    }, { onConflict: 'token' });

  return { error };
};
