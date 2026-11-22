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

  const [searchCenter, setSearchCenter] = useState<SearchCenter>(currentLocation);

  useEffect(() => {
    setSearchCenter(currentLocation);
  }, [currentLocation]);

  const [radiusKm, setRadiusKm] = useState<number>(15);
  const [customRadiusActive, setCustomRadiusActive] = useState<boolean>(false);
  const [polygonCoords, setPolygonCoords] = useState<[number, number][]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'all'
  );
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(400000);
  const [maxKm, setMaxKm] = useState<number>(50000);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'distance' | 'price_low' | 'price_high' | 'year_new'>('distance');

  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map');

  const filteredVehicles = useMemo(() => {
    const customListings: VehicleListing[] = (() => {
      try {
        return JSON.parse(localStorage.getItem('gearup_custom_listings') || '[]');
      } catch {
        return [];
      }
    })();
    const allListings = [...customListings, ...SEED_LISTINGS];

    let list = allListings.map((v) => {
      const distance = calculateDistanceKm(
        searchCenter.lat,
        searchCenter.lng,
        v.lat,
        v.lng
      );
      return { ...v, distanceKm: distance };
    });

    if (polygonCoords.length >= 3) {
      list = list.filter((v) => isPointInPolygon([v.lat, v.lng], polygonCoords));
    } else if (radiusKm > 0) {
      list = list.filter((v) => (v.distanceKm || 0) <= radiusKm);
    }

    if (selectedCategory !== 'all') {
      list = list.filter((v) => v.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedBrand !== 'all') {
      list = list.filter((v) => v.brand.toLowerCase().includes(selectedBrand.toLowerCase()));
    }

    list = list.filter((v) => v.price <= maxPrice && v.km <= maxKm);

    if (verifiedOnly) {
      list = list.filter((v) => v.documentVerified || v.inspectionScore >= 4.5);
    }

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

  const handleMapCenterClick = (lat: number, lng: number) => {
    setSearchCenter({
      name: `Custom Map Pin (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
      city: 'Custom Location',
      lat,
      lng,
    });
  };

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
    <div className="min-h-screen flex flex-col bg-[#F7F5EF] text-[#242923]">
      {/* Top Filter & Radius Control Bar */}
      <div className="sticky top-20 z-30 bg-[#F1EEE5]/95 backdrop-blur-md border-b border-[#E5E1D7] px-4 sm:px-6 py-3 shadow-subtle">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: Origin & Radius Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E5E1D7] text-xs text-[#242923] shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-[#879783]" />
              <span className="font-medium truncate max-w-[140px]">{searchCenter.name}</span>
            </div>

            {polygonCoords.length >= 3 ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F1EEE5] border border-[#879783] text-[#596B59] text-xs font-semibold animate-fade-in shadow-sm">
                <PenTool className="w-3.5 h-3.5" />
                <span>Custom Polygon Active ({polygonCoords.length} pts)</span>
                <button
                  onClick={() => setPolygonCoords([])}
                  className="ml-1 hover:text-[#242923]"
                  title="Clear polygon"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 overflow-x-auto py-1">
                {RADIUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setRadiusKm(opt.value);
                      setCustomRadiusActive(false);
                      setPolygonCoords([]);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      radiusKm === opt.value && !customRadiusActive
                        ? 'bg-[#879783] text-white shadow-sm font-semibold'
                        : 'bg-white text-[#77796F] hover:text-[#242923] border border-[#E5E1D7]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}

                <button
                  onClick={() => {
                    setCustomRadiusActive(!customRadiusActive);
                    setPolygonCoords([]);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    customRadiusActive
                      ? 'bg-[#596B59] text-white font-semibold shadow-sm'
                      : 'bg-white text-[#77796F] hover:text-[#242923] border border-[#E5E1D7]'
                  }`}
                >
                  Custom {customRadiusActive ? `(${radiusKm} km)` : ''}
                </button>
              </div>
            )}
          </div>

          {/* Right: Results Count, Sort & Mobile View */}
          <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
            <span className="text-[#77796F] font-medium">
              <strong className="text-[#242923] font-semibold">{filteredVehicles.length}</strong> machines in{' '}
              {polygonCoords.length >= 3 ? 'custom area' : radiusKm === 0 ? 'anywhere' : `${radiusKm} km`}
            </span>

            <div className="flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#77796F]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white text-[#242923] text-xs border border-[#E5E1D7] rounded-xl px-2.5 py-1 focus:outline-none shadow-sm"
              >
                <option value="distance">Nearest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="year_new">Newest Models</option>
              </select>
            </div>

            <div className="flex lg:hidden rounded-xl bg-white p-0.5 border border-[#E5E1D7] shadow-sm">
              <button
                onClick={() => setMobileView('map')}
                className={`p-1.5 rounded-lg ${mobileView === 'map' ? 'bg-[#879783] text-white' : 'text-[#77796F]'}`}
                title="Map View"
              >
                <MapIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileView('list')}
                className={`p-1.5 rounded-lg ${mobileView === 'list' ? 'bg-[#879783] text-white' : 'text-[#77796F]'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {customRadiusActive && polygonCoords.length === 0 && (
          <div className="max-w-7xl mx-auto pt-3 flex items-center gap-4 text-xs">
            <span className="text-[#77796F] font-medium">Custom Radius:</span>
            <input
              type="range"
              min="1"
              max="100"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="flex-1 accent-[#879783] cursor-pointer"
            />
            <span className="font-mono text-[#596B59] font-semibold w-12">{radiusKm} km</span>
          </div>
        )}
      </div>

      {/* Secondary Quick Filters Bar */}
      <div className="bg-[#F7F5EF] border-b border-[#E5E1D7] px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto text-xs">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white text-[#242923] border border-[#E5E1D7] rounded-xl px-3 py-1.5 focus:outline-none shadow-sm"
          >
            <option value="all">All Types</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="scooter">Scooter</option>
            <option value="electric">Electric (EV)</option>
          </select>

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-white text-[#242923] border border-[#E5E1D7] rounded-xl px-3 py-1.5 focus:outline-none shadow-sm"
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
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-sm ${
              verifiedOnly
                ? 'bg-[#879783] border-[#879783] text-white font-medium'
                : 'bg-white text-[#77796F] border-[#E5E1D7] hover:text-[#242923]'
            }`}
          >
            <span>Verified / Inspected Only</span>
          </button>

          <button
            onClick={resetFilters}
            className="px-3 py-1.5 rounded-xl text-[#77796F] hover:text-[#242923] bg-white border border-[#E5E1D7] flex items-center gap-1 ml-auto text-xs whitespace-nowrap shadow-sm"
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
          className={`lg:col-span-7 h-[550px] lg:h-full min-h-[480px] sticky top-36 rounded-3xl overflow-hidden border border-[#E5E1D7] shadow-subtle ${
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
                  isSaved={savedIds.includes(vehicle.id)}
                  onToggleSave={onToggleSave}
                  onOpenAudio={onOpenAudio}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border border-[#E5E1D7] shadow-subtle text-center space-y-4 my-10">
              <div className="w-14 h-14 rounded-2xl bg-[#F1EEE5] border border-[#E5D9C7] flex items-center justify-center text-[#879783] mx-auto">
                <Compass className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-heading font-medium text-lg text-[#242923]">
                  No rides found within {polygonCoords.length >= 3 ? 'custom boundary' : `${radiusKm} km`}
                </h3>
                <p className="text-xs text-[#77796F] mt-1 max-w-xs mx-auto">
                  Expand your radius or clear the polygon boundary to view listings in neighboring sectors.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setPolygonCoords([]);
                    setRadiusKm(radiusKm * 2 || 25);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#879783] hover:bg-[#596B59] text-white font-medium text-xs shadow-sm transition-colors"
                >
                  Expand to {radiusKm ? radiusKm * 2 : 25} km
                </button>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-xl bg-[#F7F5EF] hover:bg-[#F1EEE5] text-[#242923] border border-[#E5E1D7] font-medium text-xs transition-colors"
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
