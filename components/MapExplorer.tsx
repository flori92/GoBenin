import React, { useState, useMemo } from 'react';
import { getHeritageSites, getFeaturedDestinations, getNearbyActivities } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Location } from '../types';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapExplorerProps {
  onSelectLocation?: (location: Location) => void;
}

// Coordonnees des sites au Benin
const LOCATIONS_COORDS: Record<string, { lat: number; lng: number; icon: string }> = {
  'pendjari': { lat: 11.5, lng: 1.5, icon: 'park' },
  'royal-palaces': { lat: 7.18, lng: 1.99, icon: 'castle' },
  'ouidah': { lat: 6.36, lng: 2.08, icon: 'museum' },
  'grand-popo': { lat: 6.28, lng: 1.82, icon: 'beach_access' },
  'ganvie': { lat: 6.47, lng: 2.42, icon: 'sailing' },
  'chez-maman': { lat: 6.37, lng: 2.39, icon: 'restaurant' },
  'tata-somba': { lat: 10.3, lng: 1.3, icon: 'hotel' },
};

const BENIN_CENTER = { lat: 9.3, lng: 2.3 };
const MAP_BOUNDS = { latMin: 5.5, latMax: 12.5, lngMin: 0.5, lngMax: 4 };
const MAP_MAX_BOUNDS: L.LatLngBoundsExpression = [
  [MAP_BOUNDS.latMin, MAP_BOUNDS.lngMin],
  [MAP_BOUNDS.latMax, MAP_BOUNDS.lngMax],
];

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getStableCoords = (id: string) => {
  const hash = hashString(id);
  const latRange = MAP_BOUNDS.latMax - MAP_BOUNDS.latMin;
  const lngRange = MAP_BOUNDS.lngMax - MAP_BOUNDS.lngMin;
  const lat = MAP_BOUNDS.latMin + (hash % 1000) / 1000 * latRange;
  const lng = MAP_BOUNDS.lngMin + ((hash / 1000) % 1000) / 1000 * lngRange;
  return { lat, lng, icon: 'location_on' };
};

export const MapExplorer: React.FC<MapExplorerProps> = ({ onSelectLocation }) => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [zoom, setZoom] = useState(7);
  const [center, setCenter] = useState(BENIN_CENTER);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  
  // Get all locations
  const heritageSites = getHeritageSites(language);
  const featured = getFeaturedDestinations(language);
  const nearby = getNearbyActivities(language);
  
  const allLocations = useMemo(() => {
    const combined = [...featured, ...heritageSites, ...nearby];
    // Remove duplicates
    return combined.filter((loc, index, self) => 
      index === self.findIndex(l => l.id === loc.id)
    ).map(loc => ({
      ...loc,
      coords: LOCATIONS_COORDS[loc.id] || getStableCoords(loc.id)
    }));
  }, [featured, heritageSites, nearby]);

  const filteredLocations = useMemo(() => {
    let result = allLocations;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(loc => 
        loc.name.toLowerCase().includes(query) ||
        loc.subtitle.toLowerCase().includes(query)
      );
    }
    
    if (activeFilter !== 'all') {
      result = result.filter(loc => loc.category.toLowerCase() === activeFilter);
    }
    
    return result;
  }, [allLocations, searchQuery, activeFilter]);

  const filters = [
    { id: 'all', label: t('all'), icon: 'explore' },
    { id: 'nature', label: t('nature'), icon: 'forest' },
    { id: 'heritage', label: t('heritage'), icon: 'temple_buddhist' },
    { id: 'culture', label: t('culture'), icon: 'history_edu' },
    { id: 'food', label: t('food'), icon: 'restaurant' },
    { id: 'hotel', label: t('hotels'), icon: 'hotel' },
  ];

  const handleMarkerClick = (location: Location & { coords: { lat: number; lng: number; icon: string } }) => {
    setSelectedMarker(location.id);
    const nextCenter = { lat: location.coords.lat, lng: location.coords.lng };
    setCenter(nextCenter);
    setZoom(10);
    mapInstance?.flyTo(nextCenter, 10, { duration: 0.4 });
  };

  const handleLocationSelect = (location: Location) => {
    if (onSelectLocation) {
      onSelectLocation(location);
    }
  };

  const handleGetUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const next = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(next);
          setCenter(next);
          setZoom(12);
          mapInstance?.flyTo(next, 12, { duration: 0.5 });
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Default to Cotonou if geolocation fails
          const fallback = { lat: 6.36, lng: 2.43 };
          setCenter(fallback);
          setZoom(11);
          mapInstance?.flyTo(fallback, 11, { duration: 0.4 });
        }
      );
    }
  };

  const MapEvents = () => {
    useMapEvents({
      moveend: (event) => {
        const map = event.target;
        const nextCenter = map.getCenter();
        setCenter({ lat: nextCenter.lat, lng: nextCenter.lng });
        setZoom(map.getZoom());
      },
      zoomend: (event) => {
        const map = event.target;
        setZoom(map.getZoom());
      }
    });
    return null;
  };

  return (
    <div className={`h-screen w-full overflow-hidden flex flex-col relative transition-colors duration-300 ${theme === 'dark' ? 'bg-background-dark' : 'bg-gray-50'}`}>
      {/* Map */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={center}
          zoom={zoom}
          minZoom={5}
          maxZoom={15}
          maxBounds={MAP_MAX_BOUNDS}
          maxBoundsViscosity={0.8}
          whenCreated={setMapInstance}
          className="w-full h-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents />
          {filteredLocations.map(location => {
            const isSelected = selectedMarker === location.id;
            const markerIcon = L.divIcon({
              className: '',
              html: `<div class="${isSelected ? 'bg-primary text-navy-dark border-white' : 'bg-charcoal-card text-primary border-primary/50'} size-10 rounded-full shadow-lg border-2 flex items-center justify-center">
                      <span class="material-symbols-outlined text-lg">${location.coords.icon}</span>
                    </div>`,
              iconSize: [40, 40],
              iconAnchor: [20, 40],
            });
            return (
              <Marker
                key={location.id}
                position={[location.coords.lat, location.coords.lng]}
                icon={markerIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(location),
                }}
              />
            );
          })}
          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={L.divIcon({
                className: '',
                html: `<div class="size-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8],
              })}
            />
          )}
        </MapContainer>
        <div className="absolute inset-0 bg-navy-dark/30 pointer-events-none"></div>
      </div>

      {/* Top Search Area */}
      <div className={`relative z-20 pt-12 px-4 pb-4 w-full bg-gradient-to-b to-transparent ${theme === 'dark' ? 'from-background-dark via-background-dark/80' : 'from-gray-50 via-gray-50/80'}`}>
        <div className="flex flex-col gap-3 max-w-md mx-auto w-full">
          <div className={`flex w-full items-center h-12 rounded-xl backdrop-blur-xl shadow-lg border border-primary/20 ${theme === 'dark' ? 'bg-charcoal-card/90' : 'bg-white/90'}`}>
            <div className="flex items-center justify-center pl-4 text-primary"><span className="material-symbols-outlined">search</span></div>
            <input 
              className={`w-full bg-transparent border-none placeholder:text-gray-500 focus:ring-0 text-base font-medium px-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`} 
              placeholder={t('search_tours')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="pr-4 text-gray-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {filters.map(filter => (
              <button 
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full shadow-sm whitespace-nowrap text-sm font-medium transition-all ${
                  activeFilter === filter.id 
                    ? 'bg-primary text-navy-dark font-bold shadow-glow' 
                    : `${theme === 'dark' ? 'bg-charcoal-card/80 text-gray-300 border-white/10' : 'bg-white/80 text-gray-600 border-gray-300'} border hover:border-primary/50`
                }`}
              >
                <span className="material-symbols-outlined text-lg">{filter.icon}</span> {filter.label}
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-500 px-1">
            {t('places_found', { count: filteredLocations.length })}
          </div>
        </div>
      </div>

      <div className="flex-1"></div>

      {/* Floating Action Buttons */}
      <div className="absolute right-4 bottom-[280px] z-20 flex flex-col gap-3">
        <button 
          onClick={() => {
            const nextZoom = Math.min(15, zoom + 1);
            setZoom(nextZoom);
            mapInstance?.setZoom(nextZoom);
          }}
          className="flex size-11 items-center justify-center rounded-full bg-charcoal-card/90 backdrop-blur text-white shadow-lg border border-white/10 active:scale-95 transition-transform hover:border-primary/50"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
        <button 
          onClick={() => {
            const nextZoom = Math.max(5, zoom - 1);
            setZoom(nextZoom);
            mapInstance?.setZoom(nextZoom);
          }}
          className="flex size-11 items-center justify-center rounded-full bg-charcoal-card/90 backdrop-blur text-white shadow-lg border border-white/10 active:scale-95 transition-transform hover:border-primary/50"
        >
          <span className="material-symbols-outlined">remove</span>
        </button>
        <button 
          onClick={handleGetUserLocation}
          className="flex size-11 items-center justify-center rounded-full bg-primary text-navy-dark shadow-glow active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined">my_location</span>
        </button>
      </div>

      {/* Bottom Carousel */}
      <div className="relative z-20 w-full bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent pb-24 pt-6">
        <div className="w-full overflow-x-auto no-scrollbar px-4 pb-2">
          <div className="flex gap-4 w-max">
            {filteredLocations.slice(0, 6).map((location) => (
              <div 
                key={location.id}
                onClick={() => handleLocationSelect(location)}
                className={`flex flex-col w-[260px] bg-charcoal-card rounded-2xl p-3 shadow-xl cursor-pointer active:scale-95 transition-all border-2 ${
                  selectedMarker === location.id ? 'border-primary shadow-gold' : 'border-white/5 hover:border-primary/30'
                }`}
              >
                <div className="relative w-full h-28 rounded-xl overflow-hidden mb-3">
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${location.image}')` }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/60 to-transparent"></div>
                  <div className="absolute top-2 right-2 bg-charcoal-dark/80 backdrop-blur px-2 py-0.5 rounded-full flex items-center gap-1 border border-primary/30">
                    <span className="material-symbols-outlined text-primary text-sm fill-1">star</span>
                    <span className="text-xs font-bold text-white">{location.rating}</span>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-primary/90 text-navy-dark text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {location.category}
                    </span>
                  </div>
                </div>
                <div className="px-1">
                  <h3 className="text-base font-serif font-medium text-white leading-tight line-clamp-1">{location.name}</h3>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-1">{location.subtitle}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <span className="material-symbols-outlined text-primary text-sm">location_on</span> 
                      {location.distance || t('benin_label')}
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleMarkerClick(location); }}
                      className="text-primary text-xs font-semibold hover:underline"
                    >
                      {t('view_on_map')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
