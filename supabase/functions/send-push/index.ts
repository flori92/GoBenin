import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const EXPO_ACCESS_TOKEN = Deno.env.get('EXPO_ACCESS_TOKEN') ?? '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

type NotificationPayload = {
  record: {
    id: string;
    user_id: string;
    title: string;
    message: string;
    data?: Record<string, unknown>;
  };
};

const sendExpoPush = async (token: string, title: string, body: string, data?: Record<string, unknown>) => {
  const payload = {
    to: token,
    title,
    body,
    data,
  };

  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(EXPO_ACCESS_TOKEN ? { Authorization: `Bearer ${EXPO_ACCESS_TOKEN}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Expo push failed: ${response.status}`);
  }

  return response.json();
};

serve(async (req) => {
  try {
    const body = (await req.json()) as NotificationPayload;
    const record = body?.record;

    if (!record?.user_id) {
      return new Response('Missing user_id', { status: 400 });
    }

    const { data: tokens, error } = await supabase
      .from('push_tokens')
      .select('token, provider, enabled')
      .eq('user_id', record.user_id)
      .eq('enabled', true);

    if (error) {
      throw error;
    }

    if (!tokens || tokens.length === 0) {
      await supabase
        .from('notifications')
        .update({ delivery_status: 'failed' })
        .eq('id', record.id);
      return new Response('No tokens', { status: 200 });
    }

    const expoTokens = tokens.filter(t => t.provider === 'expo').map(t => t.token);

    for (const token of expoTokens) {
      await sendExpoPush(token, record.title, record.message, record.data || {});
    }

    await supabase
      .from('notifications')
      .update({ delivery_status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', record.id);

    return new Response('ok', { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response('error', { status: 500 });
  }
});
