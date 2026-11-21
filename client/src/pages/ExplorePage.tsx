import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  SlidersHorizontal, 
  MapPin, 
  Compass, 
  ArrowUpDown, 
  X, 
  Crosshair, 
  RotateCcw, 
  Sparkles,
  Map as MapIcon,
  List,
  PenTool,
  CheckCircle2
} from 'lucide-react';
import { VehicleListing, SearchCenter } from '../types';
import { SEED_LISTINGS } from '../data/seedListings';
import { calculateDistanceKm, isPointInPolygon, POPULAR_INDIAN_HUBS } from '../utils/geo';
import { InteractiveMap } from '../components/InteractiveMap';
import { VehicleCard } from '../components/VehicleCard';

interface ExplorePageProps {
  currentLocation: SearchCenter;
  onLocationChange: (loc: SearchCenter) => void;
  onRequestGPS: () => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onOpenAudio: (vehicle: VehicleListing) => void;
}

const RADIUS_OPTIONS = [
  { label: '2 km', value: 2 },
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 },
  { label: '15 km', value: 15 },
  { label: '25 km', value: 25 },
  { label: '50 km', value: 50 },
  { label: '100 km', value: 100 },
  { label: 'Anywhere', value: 0 },
];

export const ExplorePage: React.FC<ExplorePageProps> = ({
  currentLocation,
  onLocationChange,
  onRequestGPS,
  savedIds,
  onToggleSave,
  onOpenAudio,
}) => {
  const [searchParams] = useSearchParams();

  // Search Center state
  const [searchCenter, setSearchCenter] = useState<SearchCenter>(currentLocation);

  useEffect(() => {
    setSearchCenter(currentLocation);
  }, [currentLocation]);

  // Radius filter (defaults to 15km)
  const [radiusKm, setRadiusKm] = useState<number>(15);
  const [customRadiusActive, setCustomRadiusActive] = useState<boolean>(false);

  // Custom Polygon Search Area coordinates
  const [polygonCoords, setPolygonCoords] = useState<[number, number][]>([]);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'all'
  );
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(400000);
  const [maxKm, setMaxKm] = useState<number>(50000);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'distance' | 'price_low' | 'price_high' | 'year_new'>('distance');

  // Selected vehicle for map highlight and scroll sync
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  // Mobile Map vs List toggle
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map');

  // Compute distances & filter listings dynamically using Haversine formula & Polygon logic
  const filteredVehicles = useMemo(() => {
    let list = SEED_LISTINGS.map((v) => {
      const distance = calculateDistanceKm(
        searchCenter.lat,
        searchCenter.lng,
        v.lat,
        v.lng
      );
      return { ...v, distanceKm: distance };
    });

    // 1. Geographic Filter: Either Custom Polygon OR Radius Filter
    if (polygonCoords.length >= 3) {
      list = list.filter((v) => isPointInPolygon([v.lat, v.lng], polygonCoords));
    } else if (radiusKm > 0) {
      list = list.filter((v) => (v.distanceKm || 0) <= radiusKm);
    }

    // 2. Category Filter
    if (selectedCategory !== 'all') {
      list = list.filter((v) => v.category === selectedCategory);
    }

    // 3. Brand Filter
    if (selectedBrand !== 'all') {
      list = list.filter((v) => v.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // 4. Price & Km Filters
    list = list.filter((v) => v.price <= maxPrice && v.km <= maxKm);

    // 5. Verification Filter
    if (verifiedOnly) {
      list = list.filter((v) => v.verificationTier === 'physically_inspected' || v.verificationTier === 'document_verified');
    }

    // 6. Sorting
    list.sort((a, b) => {
      if (sortBy === 'distance') {
        return (a.distanceKm || 0) - (b.distanceKm || 0);
      } else if (sortBy === 'price_low') {
        return a.price - b.price;
      } else if (sortBy === 'price_high') {
        return b.price - a.price;
      } else if (sortBy === 'year_new') {
        return b.year - a.year;
      }
      return 0;
    });

    return list;
  }, [searchCenter, radiusKm, polygonCoords, selectedCategory, selectedBrand, maxPrice, maxKm, verifiedOnly, sortBy]);

  // Handler for user clicking anywhere on map to reset search center
  const handleMapCenterClick = (lat: number, lng: number) => {
    setSearchCenter({
      name: `Custom Map Pin (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
      city: 'Custom Location',
      lat,
      lng,
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setMaxPrice(400000);
    setMaxKm(50000);
    setVerifiedOnly(false);
    setRadiusKm(15);
    setCustomRadiusActive(false);
    setPolygonCoords([]);
    setSortBy('distance');
    setSearchCenter(currentLocation);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Filter & Radius Control Bar */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: Origin & Radius Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-semibold truncate max-w-[140px]">{searchCenter.name}</span>
            </div>

            {/* Polygon Active Badge if drawn */}
            {polygonCoords.length >= 3 ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold animate-fade-in">
                <PenTool className="w-3.5 h-3.5 text-amber-600" />
                <span>Custom Polygon Active ({polygonCoords.length} pts)</span>
                <button
                  onClick={() => setPolygonCoords([])}
                  className="ml-1 hover:text-black"
                  title="Clear polygon"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* Radius Options */
              <div className="flex items-center gap-1 overflow-x-auto py-1">
                {RADIUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setRadiusKm(opt.value);
                      setCustomRadiusActive(false);
                      setPolygonCoords([]);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      radiusKm === opt.value && !customRadiusActive
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}

                {/* Custom Radius Slider Toggle */}
                <button
                  onClick={() => {
                    setCustomRadiusActive(!customRadiusActive);
                    setPolygonCoords([]);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    customRadiusActive
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Custom {customRadiusActive ? `(${radiusKm} km)` : ''}
                </button>
              </div>
            )}
          </div>

          {/* Right: Results Count, Sort & Mobile Map/List Toggle */}
          <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
            <span className="text-slate-600 font-medium">
              <strong className="text-slate-900 font-bold">{filteredVehicles.length}</strong> rides in{' '}
              {polygonCoords.length >= 3 ? 'custom area' : radiusKm === 0 ? 'anywhere' : `${radiusKm} km`}
            </span>

            {/* Sort Selector */}
            <div className="flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 text-slate-700 text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-slate-400"
              >
                <option value="distance">Nearest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="year_new">Newest Models</option>
              </select>
            </div>

            {/* Mobile View Toggle */}
            <div className="flex lg:hidden rounded-lg bg-slate-100 p-0.5 border border-slate-200">
              <button
                onClick={() => setMobileView('map')}
                className={`p-1.5 rounded ${mobileView === 'map' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
                title="Map View"
              >
                <MapIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileView('list')}
                className={`p-1.5 rounded ${mobileView === 'list' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Custom Slider Drawer when active */}
        {customRadiusActive && polygonCoords.length === 0 && (
          <div className="max-w-7xl mx-auto pt-3 flex items-center gap-4 text-xs">
            <span className="text-slate-700 font-semibold">Custom Radius:</span>
            <input
              type="range"
              min="1"
              max="100"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="flex-1 accent-slate-900 cursor-pointer"
            />
            <span className="font-mono text-slate-900 font-bold w-12">{radiusKm} km</span>
          </div>
        )}
      </div>

      {/* Secondary Quick Filters Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto text-xs">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 text-slate-700 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-slate-400 font-medium"
          >
            <option value="all">All Types</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="scooter">Scooter</option>
            <option value="electric">Electric (EV)</option>
          </select>

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-slate-50 text-slate-700 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-slate-400 font-medium"
          >
            <option value="all">All Brands</option>
            <option value="royal enfield">Royal Enfield</option>
            <option value="honda">Honda</option>
            <option value="tvs">TVS</option>
            <option value="ather">Ather</option>
            <option value="ola">Ola Electric</option>
            <option value="bajaj">Bajaj</option>
            <option value="yamaha">Yamaha</option>
            <option value="suzuki">Suzuki</option>
            <option value="ktm">KTM</option>
          </select>

          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors whitespace-nowrap font-medium ${
              verifiedOnly
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
            }`}
          >
            <span>Verified / Inspected Only</span>
          </button>

          <button
            onClick={resetFilters}
            className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 flex items-center gap-1 ml-auto text-xs whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        </div>
      </div>

      {/* Main Content Area: Synchronized Map & Listing Cards */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-180px)]">
        {/* Left Column: Interactive Map */}
        <div
          className={`lg:col-span-7 h-[550px] lg:h-full min-h-[480px] sticky top-36 ${
            mobileView === 'list' ? 'hidden lg:block' : 'block'
          }`}
        >
          <InteractiveMap
            vehicles={filteredVehicles}
            searchCenter={searchCenter}
            radiusKm={radiusKm}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={(id) => setSelectedVehicleId(id)}
            onMapCenterChange={handleMapCenterClick}
            polygonCoords={polygonCoords}
            onPolygonChange={(pts) => setPolygonCoords(pts)}
            onClearPolygon={() => setPolygonCoords([])}
          />
        </div>

        {/* Right Column: Listing Cards List */}
        <div
          className={`lg:col-span-5 space-y-4 overflow-y-auto max-h-[calc(100vh-180px)] pr-1 ${
            mobileView === 'map' ? 'hidden lg:block' : 'block'
          }`}
        >
          {filteredVehicles.length > 0 ? (
            <div className="space-y-4">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  isSelected={vehicle.id === selectedVehicleId}
                  onSelect={() => setSelectedVehicleId(vehicle.id)}
                  isSaved={savedIds.includes(vehicle.id)}
                  onToggleSave={onToggleSave}
                  onOpenAudio={onOpenAudio}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4 my-10 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 mx-auto">
                <Compass className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  No rides found within {polygonCoords.length >= 3 ? 'custom boundary' : `${radiusKm} km`}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Expand your radius or clear the polygon boundary to view listings in neighboring sectors.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setPolygonCoords([]);
                    setRadiusKm(radiusKm * 2 || 25);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                >
                  Expand to {radiusKm ? radiusKm * 2 : 25} km
                </button>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium text-xs"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
