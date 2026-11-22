import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Search, 
  Crosshair, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  RotateCcw,
  Navigation
} from 'lucide-react';
import { PickupLocation, LocationVisibility } from '../types';
import { reverseGeocodeLocation, POPULAR_INDIAN_HUBS } from '../utils/geo';

// Fix Leaflet default marker assets
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Draggable Pickup Pin Icon
const pickupPinIcon = L.divIcon({
  className: 'custom-pickup-pin',
  html: `
    <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-full">
      <div class="w-10 h-10 rounded-none bg-gradient-to-br from-forest-600 to-forest-800 text-white flex items-center justify-center border-2 border-white shadow-2xl shadow-forest-900/80 animate-bounce">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
      <div class="absolute -bottom-1 w-3 h-1 bg-black/50 rounded-full blur-[1px]"></div>
    </div>
  `,
  iconSize: [40, 48],
  iconAnchor: [20, 48],
});

interface SellerPickupLocationPickerProps {
  initialLocation?: Partial<PickupLocation>;
  onLocationConfirmed: (location: PickupLocation) => void;
  onCancel?: () => void;
}

export const SellerPickupLocationPicker: React.FC<SellerPickupLocationPickerProps> = ({
  initialLocation,
  onLocationConfirmed,
  onCancel,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Default coordinate: Chandigarh Sector 17
  const [coordinates, setCoordinates] = useState<[number, number]>([
    initialLocation?.lat || 30.7333,
    initialLocation?.lng || 76.7794,
  ]);

  const [address, setAddress] = useState<string>(initialLocation?.address || 'Sector 17-C, Chandigarh');
  const [city, setCity] = useState<string>(initialLocation?.city || 'Chandigarh');
  const [locality, setLocality] = useState<string>(initialLocation?.locality || 'Sector 17');
  const [landmark, setLandmark] = useState<string>(initialLocation?.landmark || '');
  const [visibility, setVisibility] = useState<LocationVisibility>(
    initialLocation?.visibility || 'approximate_public'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Reverse geocode when coordinates change
  const updateAddressFromCoords = useCallback(async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      const res = await reverseGeocodeLocation(lat, lng);
      setAddress(res.address);
      setCity(res.city);
      setLocality(res.locality);
      if (res.landmark && !landmark) {
        setLandmark(res.landmark);
      }
    } finally {
      setIsGeocoding(false);
    }
  }, [landmark]);

  // Initialize Leaflet Map (Single instance, clean lifecycle)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if ((mapContainerRef.current as any)._leaflet_id) {
      delete (mapContainerRef.current as any)._leaflet_id;
    }

    const map = L.map(mapContainerRef.current, {
      center: coordinates,
      zoom: 14,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Roadmap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Draggable Marker
    const marker = L.marker(coordinates, {
      icon: pickupPinIcon,
      draggable: true,
    }).addTo(map);

    marker.bindPopup(`
      <div style="font-family:'Plus Jakarta Sans', sans-serif; font-size:11px; padding:4px;">
        <strong style="color:#176B50;">Pickup Location Marker</strong>
        <p style="margin:2px 0 0 0; color:#555;">Drag marker or tap map to adjust</p>
      </div>
    `);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      setCoordinates([pos.lat, pos.lng]);
      updateAddressFromCoords(pos.lat, pos.lng);
    });

    // Map Click Listener
    map.on('click', (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      setCoordinates([e.latlng.lat, e.latlng.lng]);
      updateAddressFromCoords(e.latlng.lat, e.latlng.lng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      map.off();
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update map position when coordinates change programmatically
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng(coordinates);
      mapInstanceRef.current.panTo(coordinates, { animate: true });
    }
  }, [coordinates]);

  // Request Current GPS Location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsGeocoding(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoordinates([latitude, longitude]);
        updateAddressFromCoords(latitude, longitude);
      },
      (err) => {
        setIsGeocoding(false);
        alert(`Could not fetch device GPS: ${err.message}. Please select on the map or type an address.`);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Search Address / Landmark
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Search against popular Indian hubs or geocode
    const matchedHub = POPULAR_INDIAN_HUBS.find(h =>
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchedHub) {
      setCoordinates([matchedHub.lat, matchedHub.lng]);
      updateAddressFromCoords(matchedHub.lat, matchedHub.lng);
    } else {
      // Nominatim search
      setIsGeocoding(true);
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', India')}&limit=1`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lng = parseFloat(data[0].lon);
            setCoordinates([lat, lng]);
            updateAddressFromCoords(lat, lng);
          } else {
            alert('Location not found. Please click your sector or neighborhood directly on the map.');
          }
        })
        .catch(() => {
          alert('Address search offline. Tap the map to drop the marker.');
        })
        .finally(() => setIsGeocoding(false));
    }
  };

  const handleConfirm = () => {
    if (!address.trim()) {
      alert('Please enter or verify a pickup address.');
      return;
    }
    const result: PickupLocation = {
      lat: coordinates[0],
      lng: coordinates[1],
      address,
      city,
      locality,
      landmark: landmark.trim() || undefined,
      visibility,
    };
    setConfirmed(true);
    onLocationConfirmed(result);
  };

  return (
    <div className="rounded-none border border-[#E9E3D8] bg-white border border-[#E9E3D8]/80 p-6 space-y-6 text-[#242622] shadow-2xl">
      <div>
        <span className="text-[10px] font-bold text-[#242622] uppercase tracking-widest">
          STEP: VEHICLE PICKUP & INSPECTION LOCATION
        </span>
        <h3 className="font-heading font-extrabold text-xl text-[#242622] mt-0.5">
          Where will buyers & inspectors view the vehicle?
        </h3>
        <p className="text-xs text-[#85857E] mt-1">
          Drop a marker on your neighborhood or workshop. You can choose whether to keep exact house details private until a test ride is confirmed.
        </p>
      </div>

      {/* Search Toolbar & Current Location Button */}
      <div className="flex flex-col sm:flex-row gap-2">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 bg-white px-3 py-2 rounded-none border border-[#E9E3D8]">
          <Search className="w-4 h-4 text-[#242622] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search sector, locality or landmark (e.g. Sector 35 Chandigarh, Saket Delhi)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-[#242622] placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-[#35483C]/30 hover:bg-[#35483C] rounded-lg text-white font-bold text-xs whitespace-nowrap"
          >
            Search
          </button>
        </form>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#E9E3D8] hover:bg-[#E9E3D8]/40 border border-[#E9E3D8] rounded-none text-xs font-bold text-[#35483C] whitespace-nowrap transition-colors"
        >
          <Crosshair className="w-4 h-4 text-[#242622]" />
          <span>Use Current GPS</span>
        </button>
      </div>

      {/* Interactive Leaflet Map for Pickup */}
      <div className="relative rounded-none overflow-hidden border border-[#E9E3D8] h-72 sm:h-80 w-full shadow-inner">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Drag Hint Pill */}
        <div className="absolute top-3 left-3 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-none border border-[#E9E3D8] text-[11px] text-[#242622] shadow-elevated flex items-center gap-2">
          <Navigation className="w-3.5 h-3.5 text-[#242622] animate-pulse" />
          <span>Tap anywhere or drag the pin to your exact pickup gate / parking</span>
        </div>

        {/* Loading Spinner */}
        {isGeocoding && (
          <div className="absolute inset-0 z-[450] bg-black/40 backdrop-blur-[2px] flex items-center justify-center text-xs font-bold text-[#35483C]">
            Fetching location address details...
          </div>
        )}
      </div>

      {/* Coordinate & Address Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="text-[#85857E] font-semibold mb-1 block">Selected Locality / Sector</label>
          <input
            type="text"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            className="w-full bg-white border border-[#E9E3D8] rounded-none px-3 py-2 text-[#242622] font-medium"
          />
        </div>

        <div>
          <label className="text-[#85857E] font-semibold mb-1 block">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-white border border-[#E9E3D8] rounded-none px-3 py-2 text-[#242622] font-medium"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-[#85857E] font-semibold mb-1 block">Full Pickup Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-white border border-[#E9E3D8] rounded-none px-3 py-2 text-[#242622]"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-[#85857E] font-semibold mb-1 block">Optional Landmark / Instructions</label>
          <input
            type="text"
            placeholder="e.g. Near Community Centre gate, Opposite City Park"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            className="w-full bg-white border border-[#E9E3D8] rounded-none px-3 py-2 text-[#242622]"
          />
        </div>
      </div>

      {/* Latitude & Longitude display for verification */}
      <div className="p-3 rounded-none bg-[#E9E3D8] border border-[#E9E3D8] flex items-center justify-between text-[11px] text-[#85857E] font-mono">
        <span>Verified Coordinates:</span>
        <span className="text-[#242622] font-bold">
          LAT: {coordinates[0].toFixed(5)}, LNG: {coordinates[1].toFixed(5)}
        </span>
      </div>

      {/* Location Privacy Preferences (Core Phase 4 Requirement) */}
      <div className="p-4 rounded-none bg-[#0C1713] border border-[#E9E3D8] space-y-3">
        <h4 className="font-bold text-xs text-[#242622] flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#242622]" />
          <span>Seller Location Privacy Preference</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <label
            onClick={() => setVisibility('approximate_public')}
            className={`p-3 rounded-none border cursor-pointer transition-all ${
              visibility === 'approximate_public'
                ? 'bg-[#E9E3D8] border-forest-400 text-white shadow-sm'
                : 'bg-white/50 border-[#E9E3D8] text-[#85857E]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#242622]" />
              <p className="font-bold text-[#242622]">Approximate Locality (Recommended)</p>
            </div>
            <p className="text-[11px] text-[#85857E] mt-1">
              Public listings show only your neighborhood (e.g. &ldquo;{locality}, {city}&rdquo;). Exact door/building is hidden.
            </p>
          </label>

          <label
            onClick={() => setVisibility('exact_verified_only')}
            className={`p-3 rounded-none border cursor-pointer transition-all ${
              visibility === 'exact_verified_only'
                ? 'bg-[#E9E3D8] border-[#35483C] text-[#242622] shadow-sm'
                : 'bg-white/50 border-[#E9E3D8] text-[#85857E]'
            }`}
          >
            <div className="flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-gold-light" />
              <p className="font-bold text-[#242622]">Exact Location Verified Only</p>
            </div>
            <p className="text-[11px] text-[#85857E] mt-1">
              Exact coordinates & address provided strictly to verified buyers after they schedule an authenticated test ride.
            </p>
          </label>
        </div>
      </div>

      {/* Confirmation CTA */}
      <div className="flex items-center justify-between pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-none bg-white text-[#85857E] hover:text-[#242622] border border-[#E9E3D8] text-xs font-semibold"
          >
            Cancel
          </button>
        )}

        <button
          type="button"
          onClick={handleConfirm}
          className="ml-auto px-6 py-3 rounded-none bg-[#35483C] hover:bg-[#242622] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-elevated"
        >
          <CheckCircle2 className="w-4 h-4 text-[#242622]" />
          <span>Confirm Pickup Location</span>
        </button>
      </div>
    </div>
  );
};
