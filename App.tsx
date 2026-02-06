import React, { useState } from 'react';
import { ViewState, Location } from './types';
import { Home } from './components/Home';
import { Navigation } from './components/Navigation';
import { Details } from './components/Details';
import { Tours } from './components/Tours';
import { Bookings } from './components/Bookings';
import { MapExplorer } from './components/MapExplorer';
import { Profile } from './components/Profile';
import { SplashScreen } from './components/SplashScreen';
import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  const [view, setView] = useState<ViewState>('SPLASH');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

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

  const Content = () => {
    if (view === 'SPLASH') {
      return <SplashScreen onFinish={handleSplashFinish} />;
    }

    if (view === 'DETAILS' && selectedLocation) {
      return <Details location={selectedLocation} onBack={handleBackFromDetails} />;
    }

    return (
      <div className="h-full min-h-screen w-full relative">
        {view === 'HOME' && <Home onSelectLocation={handleSelectLocation} />}
        {view === 'TOURS' && <Tours />}
        {view === 'MAP' && <MapExplorer onSelectLocation={handleSelectLocation} />}
        {view === 'BOOKINGS' && <Bookings onChangeView={setView} />}
        {view === 'PROFILE' && <Profile />}
        
        {/* Navigation is persistent across main tabs */}
        <Navigation currentView={view} onChangeView={setView} />
      </div>
    );
  };

  return (
    <LanguageProvider>
      <Content />
    </LanguageProvider>
  );
}
