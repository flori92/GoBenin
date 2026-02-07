import { supabase } from './supabase';

export type PushProvider = 'expo' | 'fcm' | 'apns';
export type PushPlatform = 'ios' | 'android' | 'web';

export const upsertPushToken = async (params: {
  userId: string;
  token: string;
  provider: PushProvider;
  platform: PushPlatform;
  deviceId?: string;
}) => {
  const { userId, token, provider, platform, deviceId } = params;

  const { error } = await supabase
    .from('push_tokens')
    .upsert(
      {
        user_id: userId,
        token,
        provider,
        platform,
        device_id: deviceId || null,
        enabled: true,
        last_seen_at: new Date().toISOString(),
      },
      { onConflict: 'token' }
    );

  return { error };
};
