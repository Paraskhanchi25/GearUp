import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingBikeBuddy } from './components/FloatingBikeBuddy';
import { AudioPlayerModal } from './components/AudioPlayerModal';
import { SearchCenter, VehicleListing } from './types';
import { POPULAR_INDIAN_HUBS } from './utils/geo';

// Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { BikeDetailPage } from './pages/BikeDetailPage';
import { SellBikePage } from './pages/SellBikePage';
import { ResaleStudioPage } from './pages/ResaleStudioPage';
import { AIBuddyPage } from './pages/AIBuddyPage';
import { BikeDoctorPage } from './pages/BikeDoctorPage';
import { ComparePage } from './pages/ComparePage';
import { PriceEstimatorPage } from './pages/PriceEstimatorPage';
import { DashboardPage } from './pages/Dashboard';
import { TrustPage } from './pages/TrustPage';
import { AuthPage } from './pages/AuthPage';
import { AdminPage } from './pages/AdminPage';

export const App: React.FC = () => {
  // Default Search Origin: Chandigarh (Sector 17)
  const [currentLocation, setCurrentLocation] = useState<SearchCenter>(POPULAR_INDIAN_HUBS[0]);
  const [savedIds, setSavedIds] = useState<string[]>(['bike-001', 'bike-003']);
  const [audioVehicle, setAudioVehicle] = useState<VehicleListing | null>(null);

  // Toggle Favorite Listing
  const handleToggleSave = (id: string) => {
    if (savedIds.includes(id)) {
      setSavedIds(savedIds.filter((item) => item !== id));
    } else {
      setSavedIds([...savedIds, id]);
    }
  };

  // GPS Device Location Request with explicit user fallback
  const handleRequestGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Defaulting to Chandigarh Sector 17.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({
          name: `Device GPS (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`,
          city: 'Current Location',
          lat: latitude,
          lng: longitude,
        });
      },
      (error) => {
        console.warn('GPS location request error or denied:', error.message);
        alert(
          'Could not retrieve live GPS coordinates. You can select any Indian city (Chandigarh, Delhi, Bengaluru, Pune, Mumbai) directly from the header dropdown!'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F7F5EF] text-[#242923] flex flex-col font-sans selection:bg-[#879783] selection:text-white">
        <Navbar
          currentLocation={currentLocation}
          onLocationChange={setCurrentLocation}
          onRequestGPS={handleRequestGPS}
        />

        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  currentLocation={currentLocation}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  onOpenAudio={setAudioVehicle}
                />
              }
            />
            <Route
              path="/explore"
              element={
                <ExplorePage
                  currentLocation={currentLocation}
                  onLocationChange={setCurrentLocation}
                  onRequestGPS={handleRequestGPS}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  onOpenAudio={setAudioVehicle}
                />
              }
            />
            <Route
              path="/bike/:id"
              element={
                <BikeDetailPage
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                />
              }
            />
            <Route path="/inspect/:id" element={<Navigate to="/explore" replace />} />
            <Route path="/sell" element={<SellBikePage />} />
            <Route path="/resale-studio" element={<ResaleStudioPage />} />
            <Route path="/bike-doctor" element={<BikeDoctorPage />} />
            <Route path="/ai-buddy" element={<AIBuddyPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/price-estimator" element={<PriceEstimatorPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/buyer" element={<DashboardPage />} />
            <Route path="/dashboard/seller" element={<DashboardPage />} />
            <Route path="/dashboard/dealer" element={<DashboardPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/how-it-works" element={<Navigate to="/trust" replace />} />
            <Route path="/trust" element={<TrustPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
          </Routes>
        </main>

        <Footer />

        {/* Global Floating AI Bike Buddy */}
        <FloatingBikeBuddy />

        {/* Global Rider Audio Story Player Modal */}
        <AudioPlayerModal
          vehicle={audioVehicle}
          onClose={() => setAudioVehicle(null)}
        />
      </div>
    </BrowserRouter>
  );
};

export default App;
