import React, { useState, useEffect, useMemo } from 'react';
import { ViewState, Location, Tour, Booking } from './types';
import { Home } from './components/Home';
import { Navigation } from './components/Navigation';
import { Details } from './components/Details';
import { Tours } from './components/Tours';
import { TourDetails } from './components/TourDetails';
import { Bookings } from './components/Bookings';
import { MapExplorer } from './components/MapExplorer';
import { Profile } from './components/Profile';
import { SplashScreen } from './components/SplashScreen';
import { BookingModal, BookingData } from './components/BookingModal';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProgressProvider } from './contexts/UserProgressContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider, useNotifications } from './contexts/NotificationContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { formatDateISO } from './lib/format';
import { SmartBookingData } from './components/BookingHub';

const AppInner = () => {
  const { t, language } = useLanguage();
  const { notify, seed } = useNotifications();
  const [view, setView] = useState<ViewState>('SPLASH');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [bookingItem, setBookingItem] = useState<Tour | Location | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('gobenin-bookings');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    localStorage.setItem('gobenin-bookings', JSON.stringify(userBookings));
  }, [userBookings]);

  const initialNotifications = useMemo(() => {
    const now = Date.now();
    return [
      {
        id: 'seed-booking',
        title: t('booking_confirmed'),
        message: t('booking_confirmed_desc'),
        type: 'booking' as const,
        createdAt: now - 1000 * 60 * 45,
        read: false,
        link: { view: 'BOOKINGS' as const },
      },
      {
        id: 'seed-promo',
        title: t('promo_title'),
        message: t('promo_desc'),
        type: 'promo' as const,
        createdAt: now - 1000 * 60 * 120,
        read: false,
        link: { view: 'TOURS' as const },
      },
    ];
  }, [t]);

  useEffect(() => {
    seed(initialNotifications);
  }, [initialNotifications, seed]);

  const handleSplashFinish = () => {
    setView('HOME');
  };

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
    setView('DETAILS');
  };

  const handleBackFromDetails = () => {
    setSelectedLocation(null);
    setView('HOME');
  };

  const handleSelectTour = (tour: Tour) => {
    setSelectedTour(tour);
    setView('TOUR_DETAILS');
  };

  const handleBackFromTourDetails = () => {
    setSelectedTour(null);
    setView('TOURS');
  };

  const handleBookTour = (tour: Tour) => {
    setBookingItem(tour);
  };

  const handleBookLocation = (location: Location) => {
    setBookingItem(location);
  };

  const handleCloseBooking = () => {
    setBookingItem(null);
  };

  const handleConfirmBooking = (bookingData: BookingData) => {
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      title: bookingData.itemName,
      dateISO: bookingData.dateISO,
      time24: bookingData.time24,
      guestsCount: bookingData.guests,
      guestsLabel: bookingData.guestsLabel,
      status: 'Confirmed',
      image: bookingData.image,
      provider: bookingData.provider || 'GoBenin',
      totalPrice: bookingData.totalPrice,
      currency: bookingData.currency,
    };

    setUserBookings(prev => [newBooking, ...prev]);
    setBookingItem(null);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);

    notify({
      title: t('booking_confirmed'),
      message: t('booking_confirmed_details', {
        name: bookingData.itemName,
        date: formatDateISO(bookingData.dateISO, language),
      }),
      type: 'booking',
    });
  };

  const handleSmartBooking = (data: SmartBookingData) => {
    const stayLabel = `${formatDateISO(data.checkIn, language)} → ${formatDateISO(data.checkOut, language)}`;
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      title: data.locationName,
      dateLabel: stayLabel,
      timeLabel: t('flexible_checkin'),
      guestsLabel: t('guests_people', { count: data.guests }),
      status: 'Confirmed',
      image: data.image,
      provider: data.provider,
      totalPrice: data.totalPrice,
      currency: data.currency,
    };

    setUserBookings(prev => [newBooking, ...prev]);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);

    notify({
      title: t('booking_confirmed'),
      message: t('booking_confirmed_stay_desc', {
        name: data.locationName,
        date: formatDateISO(data.checkIn, language),
      }),
      type: 'booking',
    });
  };

  const Content = () => {
    if (view === 'SPLASH') {
      return <SplashScreen onFinish={handleSplashFinish} />;
    }

    if (view === 'DETAILS' && selectedLocation) {
      return (
        <Details
          location={selectedLocation}
          onBack={handleBackFromDetails}
          onBook={() => handleBookLocation(selectedLocation)}
          onSmartBook={handleSmartBooking}
        />
      );
    }

    if (view === 'TOUR_DETAILS' && selectedTour) {
      return (
        <TourDetails
          tour={selectedTour}
          onBack={handleBackFromTourDetails}
          onBook={() => handleBookTour(selectedTour)}
          onViewOnMap={() => setView('MAP')}
        />
      );
    }

    return (
      <div className="h-full min-h-screen w-full relative">
        {view === 'HOME' && <Home onSelectLocation={handleSelectLocation} onChangeView={setView} />}
        {view === 'TOURS' && <Tours onBookTour={handleBookTour} onSelectTour={handleSelectTour} onViewOnMap={() => { setView('MAP'); }} />}
        {view === 'MAP' && <MapExplorer onSelectLocation={handleSelectLocation} />}
        {view === 'BOOKINGS' && <Bookings onChangeView={setView} customBookings={userBookings} />}
        {view === 'PROFILE' && <Profile />}

        {/* Navigation is persistent across main tabs */}
        <Navigation currentView={view} onChangeView={setView} />
      </div>
    );
  };

  const SuccessToast = () => {
    return (
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
        <span className="material-symbols-outlined">check_circle</span>
        {t('booking_success')}
      </div>
    );
  };

  return (
    <>
      <Content />

      {/* Booking Modal */}
      {bookingItem && (
        <BookingModal
          item={bookingItem}
          onClose={handleCloseBooking}
          onConfirm={handleConfirmBooking}
        />
      )}

      {/* Success Toast */}
      {showSuccessToast && <SuccessToast />}
    </>
  );
};

export default function App() {
  const NotificationBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    return <NotificationProvider userId={user?.id}>{children}</NotificationProvider>;
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <NotificationBridge>
            <UserProgressProvider>
              <FavoritesProvider>
                <AppInner />
              </FavoritesProvider>
            </UserProgressProvider>
          </NotificationBridge>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
