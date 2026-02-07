import React, { useState, useEffect } from 'react';
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
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
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
    };
    
    setUserBookings(prev => [newBooking, ...prev]);
    setBookingItem(null);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const Content = () => {
    if (view === 'SPLASH') {
      return <SplashScreen onFinish={handleSplashFinish} />;
    }

    if (view === 'DETAILS' && selectedLocation) {
      return <Details location={selectedLocation} onBack={handleBackFromDetails} onBook={() => handleBookLocation(selectedLocation)} />;
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
        {view === 'HOME' && <Home onSelectLocation={handleSelectLocation} />}
        {view === 'TOURS' && <Tours onBookTour={handleBookTour} onSelectTour={handleSelectTour} onViewOnMap={(tour) => { setView('MAP'); }} />}
        {view === 'MAP' && <MapExplorer onSelectLocation={handleSelectLocation} />}
        {view === 'BOOKINGS' && <Bookings onChangeView={setView} customBookings={userBookings} />}
        {view === 'PROFILE' && <Profile />}
        
        {/* Navigation is persistent across main tabs */}
        <Navigation currentView={view} onChangeView={setView} />
      </div>
    );
  };

  const SuccessToast = () => {
    const { t } = useLanguage();
    return (
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
        <span className="material-symbols-outlined">check_circle</span>
        {t('booking_success')}
      </div>
    );
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <UserProgressProvider>
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
          </UserProgressProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
