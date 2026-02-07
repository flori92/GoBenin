import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useTheme, useLanguage, useAuth } from '../contexts';
import { colors, spacing, fontSize, borderRadius } from '../theme';
import { Header } from '../components';
import { fetchUserBookings } from '../../lib/bookings';

type BookingStatus = 'confirmed' | 'pending' | 'cancelled';
type TabType = 'upcoming' | 'past';

interface Booking {
  id: string;
  item_id: string;
  item_type: string;
  item_name: string;
  item_image?: string;
  date: string;
  guests: number;
  total_price: number;
  status: BookingStatus;
  created_at: string;
}

export const BookingsScreen = ({ navigation }: any) => {
  const { colors: themeColors } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  useEffect(() => {
    if (user?.id) {
      loadBookings();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  const loadBookings = async () => {
    if (!user?.id) return;
    try {
      const data = await fetchUserBookings(user.id);
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredBookings = useMemo(() => {
    const now = new Date();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      if (activeTab === 'upcoming') {
        return bookingDate >= now && booking.status !== 'cancelled';
      } else {
        return bookingDate < now || booking.status === 'cancelled';
      }
    });
  }, [bookings, activeTab]);
  
  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed': return colors.status.success;
      case 'pending': return colors.status.warning;
      case 'cancelled': return colors.status.error;
    }
  };
  
  const getStatusLabel = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed': return 'Confirmé';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
    }
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderBookingCard = ({ item }: { item: Booking }) => (
    <TouchableOpacity
      style={[styles.bookingCard, { backgroundColor: themeColors.card }]}
      onPress={() => setSelectedBooking(item)}
    >
      {item.item_image && (
        <Image
          source={{ uri: item.item_image }}
          style={styles.bookingImage}
          contentFit="cover"
        />
      )}
      
      <View style={styles.bookingContent}>
        <View style={styles.bookingHeader}>
          <Text style={[styles.bookingName, { color: themeColors.text }]} numberOfLines={1}>
            {item.item_name}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {getStatusLabel(item.status)}
            </Text>
          </View>
        </View>
        
        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={themeColors.textSecondary} />
            <Text style={[styles.detailText, { color: themeColors.textSecondary }]}>
              {formatDate(item.date)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={16} color={themeColors.textSecondary} />
            <Text style={[styles.detailText, { color: themeColors.textSecondary }]}>
              {item.guests} {t('guests')}
            </Text>
          </View>
        </View>
        
        <View style={styles.bookingFooter}>
          <Text style={[styles.bookingPrice, { color: colors.primary }]}>
            ${item.total_price}
          </Text>
          
          {item.status === 'confirmed' && (
            <TouchableOpacity 
              style={styles.ticketButton}
              onPress={() => setSelectedBooking(item)}
            >
              <Ionicons name="qr-code" size={16} color={colors.primary} />
              <Text style={styles.ticketButtonText}>{t('view_ticket')}</Text>
            </TouchableOpacity>
          )}
          
          {item.status === 'pending' && (
            <TouchableOpacity style={styles.payButton}>
              <Text style={styles.payButtonText}>{t('complete_payment')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Header title={t('my_bookings')} />
        <View style={styles.emptyState}>
          <Ionicons name="log-in-outline" size={64} color={themeColors.textSecondary} />
          <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
            Connectez-vous pour voir vos réservations
          </Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.loginButtonText}>{t('login')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header title={t('my_bookings')} />
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'upcoming' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'upcoming' ? colors.primary : themeColors.textSecondary }
          ]}>
            {t('upcoming')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'past' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'past' ? colors.primary : themeColors.textSecondary }
          ]}>
            {t('past')}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        renderItem={renderBookingCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.bookingsList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={themeColors.textSecondary} />
            <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
              {t('no_bookings')}
            </Text>
            <TouchableOpacity 
              style={styles.exploreButton}
              onPress={() => navigation.navigate('Tours')}
            >
              <Text style={styles.exploreButtonText}>{t('explore_circuits')}</Text>
            </TouchableOpacity>
          </View>
        }
      />
      
      {/* Booking Details Modal */}
      <Modal
        visible={!!selectedBooking}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedBooking(null)}
      >
        {selectedBooking && (
          <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>
                Détails de la réservation
              </Text>
              <TouchableOpacity onPress={() => setSelectedBooking(null)}>
                <Ionicons name="close" size={24} color={themeColors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.qrContainer}>
                <QRCode
                  value={`gobenin://booking/${selectedBooking.id}`}
                  size={180}
                  backgroundColor="white"
                  color="black"
                />
              </View>
              
              <View style={[styles.detailsCard, { backgroundColor: themeColors.card }]}>
                <Text style={[styles.detailLabel, { color: themeColors.textSecondary }]}>
                  Réservation
                </Text>
                <Text style={[styles.detailValue, { color: themeColors.text }]}>
                  {selectedBooking.item_name}
                </Text>
                
                <Text style={[styles.detailLabel, { color: themeColors.textSecondary, marginTop: spacing.md }]}>
                  Date
                </Text>
                <Text style={[styles.detailValue, { color: themeColors.text }]}>
                  {formatDate(selectedBooking.date)}
                </Text>
                
                <Text style={[styles.detailLabel, { color: themeColors.textSecondary, marginTop: spacing.md }]}>
                  Personnes
                </Text>
                <Text style={[styles.detailValue, { color: themeColors.text }]}>
                  {selectedBooking.guests}
                </Text>
                
                <Text style={[styles.detailLabel, { color: themeColors.textSecondary, marginTop: spacing.md }]}>
                  Total
                </Text>
                <Text style={[styles.detailValue, { color: colors.primary }]}>
                  ${selectedBooking.total_price}
                </Text>
                
                <Text style={[styles.detailLabel, { color: themeColors.textSecondary, marginTop: spacing.md }]}>
                  Statut
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedBooking.status) + '20', alignSelf: 'flex-start' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(selectedBooking.status) }]}>
                    {getStatusLabel(selectedBooking.status)}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  bookingsList: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  bookingCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  bookingImage: {
    width: '100%',
    height: 120,
  },
  bookingContent: {
    padding: spacing.md,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  bookingDetails: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: fontSize.sm,
    marginLeft: spacing.xs,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  bookingPrice: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  ticketButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ticketButtonText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  payButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  payButtonText: {
    color: '#fff',
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: fontSize.lg,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  exploreButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  qrContainer: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: '#fff',
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  detailsCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  detailLabel: {
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
});
