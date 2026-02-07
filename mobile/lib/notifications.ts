import { supabase } from './supabase';
import { NotificationItem } from './types';

export const fetchNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('id, title, message, type, created_at, read_at, data')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return (data || []) as NotificationItem[];
};

export const markNotificationRead = async (id: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
};

export const markAllNotificationsRead = async (userId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', userId);
  if (error) throw error;
};

export const deleteNotification = async (id: string) => {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

export const createNotification = async (userId: string, payload: { title: string; message: string; type: string; data?: Record<string, unknown> }) => {
  const { error } = await supabase.from('notifications').insert({
    user_id: userId,
    title: payload.title,
    message: payload.message,
    type: payload.type,
    data: payload.data || {},
    channel: 'in_app',
  });
  if (error) throw error;
};
