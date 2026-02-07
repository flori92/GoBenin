import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from './lib/supabase';
import { registerForPushNotificationsAsync, upsertPushToken } from './lib/push';
import {
  createNotification,
  deleteNotification,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from './lib/notifications';
import { NotificationItem } from './lib/types';
import { getSampleBookings } from './lib/bookings';

const Input = (props: any) => (
  <TextInput
    placeholderTextColor="#888"
    style={styles.input}
    {...props}
  />
);

const Badge = ({ label }: { label: string }) => (
  <View style={styles.badge}>
    <Text style={styles.badgeText}>{label}</Text>
  </View>
);

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [tab, setTab] = useState<'bookings' | 'notifications' | 'profile'>('bookings');

  const unreadCount = useMemo(
    () => notifications.filter(item => !item.read_at).length,
    [notifications]
  );

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUserId(data.session.user.id);
        setStatus('Session active.');
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setStatus('Signed in.');
      } else {
        setUserId(null);
        setStatus('Signed out.');
      }
    });

    init();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      return;
    }

    let channel: ReturnType<typeof supabase.channel> | null = null;

    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications(userId);
        setNotifications(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadNotifications();

    channel = supabase
      .channel(`mobile-notifications-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        payload => {
          setNotifications(prev => [payload.new as NotificationItem, ...prev]);
        }
      )
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleSignIn = async () => {
    setLoading(true);
    setStatus('Signing in...');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus(error.message);
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    setStatus('Creating account...');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setStatus(error.message);
    } else {
      setStatus('Check your email to confirm.');
    }
    setLoading(false);
  };

  const handleRegisterPush = async () => {
    if (!userId) {
      setStatus('Login required.');
      return;
    }

    try {
      setLoading(true);
      setStatus('Registering push token...');
      const token = await registerForPushNotificationsAsync();
      const { error } = await upsertPushToken(userId, token);
      if (error) {
        setStatus(error.message);
      } else {
        setStatus('Push token registered.');
      }
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Push registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleMarkRead = async (id: string) => {
    setNotifications(prev => prev.map(item => (item.id === id ? { ...item, read_at: new Date().toISOString() } : item)));
    try {
      await markNotificationRead(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    if (!userId) return;
    setNotifications(prev => prev.map(item => ({ ...item, read_at: new Date().toISOString() })));
    try {
      await markAllNotificationsRead(userId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
    try {
      await deleteNotification(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDemoNotification = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      await createNotification(userId, {
        title: 'Smart deal detected',
        message: 'Price drop for Ouidah Beach Stay.',
        type: 'price',
      });
      setStatus('Notification created.');
    } catch (err) {
      setStatus('Failed to create notification.');
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>GoBenin Mobile</Text>
          <Text style={styles.subtitle}>Expo + Supabase + Push</Text>

          <Input
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <View style={styles.row}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleSignIn} disabled={loading}>
              <Text style={styles.primaryButtonText}>Sign in</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleSignUp} disabled={loading}>
              <Text style={styles.secondaryButtonText}>Sign up</Text>
            </TouchableOpacity>
          </View>

          {loading && <ActivityIndicator style={{ marginTop: 16 }} />}
          {status ? <Text style={styles.status}>{status}</Text> : null}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>GoBenin Mobile</Text>
        <View style={styles.headerRight}>
          <Text style={styles.headerText}>Notifications</Text>
          <Badge label={String(unreadCount)} />
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab === 'bookings' && styles.tabActive]} onPress={() => setTab('bookings')}>
          <Text style={styles.tabText}>Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'notifications' && styles.tabActive]} onPress={() => setTab('notifications')}>
          <Text style={styles.tabText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'profile' && styles.tabActive]} onPress={() => setTab('profile')}>
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {tab === 'bookings' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming stays</Text>
            {getSampleBookings().map(item => (
              <View key={item.id} style={styles.cardRow}>
                <View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardMeta}>{item.date_label}</Text>
                  <Text style={styles.cardMeta}>{item.guests_label}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.cardBadge}>{item.provider}</Text>
                  <Text style={styles.cardPrice}>{item.total_price}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {tab === 'notifications' && (
          <View style={styles.section}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>Realtime notifications</Text>
              <TouchableOpacity onPress={handleMarkAllRead}>
                <Text style={styles.link}>Mark all read</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleDemoNotification}>
              <Text style={styles.secondaryButtonText}>Create test notification</Text>
            </TouchableOpacity>
            {notifications.length === 0 ? (
              <Text style={styles.emptyText}>No notifications yet.</Text>
            ) : (
              notifications.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.cardRow, !item.read_at && styles.cardRowUnread]}
                  onPress={() => handleMarkRead(item.id)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardMeta}>{item.message}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteNotification(item.id)}>
                    <Text style={styles.link}>Dismiss</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {tab === 'profile' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <Text style={styles.cardMeta}>User ID: {userId}</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={handleRegisterPush} disabled={loading}>
              <Text style={styles.primaryButtonText}>Register Push Token</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleSignOut} disabled={loading}>
              <Text style={styles.secondaryButtonText}>Sign out</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {loading && <ActivityIndicator style={{ marginTop: 16 }} />}
      {status ? <Text style={styles.status}>{status}</Text> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    color: '#aaa',
    fontSize: 12,
  },
  badge: {
    backgroundColor: '#EAA62B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: '#1b1200',
    fontWeight: '700',
    fontSize: 12,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2c2c2c',
    padding: 10,
    alignItems: 'center',
  },
  tabActive: {
    borderColor: '#EAA62B',
    backgroundColor: '#1b1200',
  },
  tabText: {
    color: '#EAA62B',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#151515',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2c2c2c',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: '#151515',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2c2c2c',
    marginBottom: 12,
  },
  cardRowUnread: {
    borderColor: '#EAA62B',
    backgroundColor: '#1b1200',
  },
  cardTitle: {
    color: '#fff',
    fontWeight: '700',
  },
  cardMeta: {
    color: '#999',
    marginTop: 4,
  },
  cardBadge: {
    color: '#EAA62B',
    fontSize: 12,
    fontWeight: '700',
  },
  cardPrice: {
    color: '#fff',
    fontWeight: '700',
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#2c2c2c',
  },
  primaryButton: {
    backgroundColor: '#EAA62B',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  primaryButtonText: {
    color: '#1b1200',
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#EAA62B',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#EAA62B',
    fontWeight: '700',
  },
  link: {
    color: '#EAA62B',
    fontWeight: '600',
  },
  emptyText: {
    color: '#777',
    marginTop: 12,
  },
  status: {
    color: '#aaa',
    marginTop: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: '#aaa',
    marginTop: 6,
    marginBottom: 16,
  },
});
