export type VehicleCategory = 'motorcycle' | 'scooter' | 'electric';
export type FuelType = 'petrol' | 'electric' | 'hybrid';
export type SellerType = 'individual' | 'verified_dealer' | 'inspection_partner';
export type VerificationTier = 'seller_provided' | 'ai_estimated' | 'document_verified' | 'physically_inspected';
export type LocationVisibility = 'approximate_public' | 'exact_verified_only';
export type MapTileLayerType = 'roadmap' | 'satellite';

export interface PickupLocation {
  lat: number;
  lng: number;
  address: string;
  city: string;
  locality: string;
  landmark?: string;
  visibility: LocationVisibility;
}

export interface VehicleListing {
  id: string;
  title: string;
  brand: string;
  model: string;
  variant: string;
  category: VehicleCategory;
  year: number;
  regYear: number;
  regState: string;
  rtoCode: string;
  km: number;
  fuel: FuelType;
  owners: number;
  price: number;
  originalMrp: number;
  
  // Location
  city: string;
  state: string;
  area: string;
  lat: number;
  lng: number;
  distanceKm?: number;

  // Pickup Details & Location Privacy
  pickupAddress?: string;
  pickupCity?: string;
  pickupLocality?: string;
  pickupLandmark?: string;
  locationVisibility?: LocationVisibility;

  // Verification & Ratings
  sellerType: SellerType;
  sellerName: string;
  sellerPhone?: string;
  verificationTier: VerificationTier;
  inspectionScore: number; // e.g. 4.8 / 5
  documentVerified: boolean;
  insuranceValidUntil: string;
  pucValidUntil: string;
  batteryHealth?: number; // for EV

  // AI Insights
  aiFairPriceMin: number;
  aiFairPriceMax: number;
  aiSuggestedPrice: number;
  aiDealBadge: 'good_deal' | 'fair_price' | 'overpriced';
  aiCosmeticScore: number; // out of 10
  aiCosmeticNotes: string[];
  aiMechanicalNotes: string[];
  missingPhotosAlerts?: string[];

  // Media
  primaryImage: string;
  galleryImages: string[];
  audioStory?: {
    title: string;
    duration: number; // seconds
    audioUrl: string;
    transcript: string;
    speakerName: string;
  };

  specs: {
    engineCc?: number;
    powerBhp?: string;
    mileageKmpl?: number;
    rangeKm?: number; // for EV
    topSpeedKmph?: number;
    kerbWeightKg?: number;
    fuelTankL?: number;
  };

  createdAt: string;
}

export interface SearchCenter {
  name: string;
  city: string;
  lat: number;
  lng: number;
}

export interface PlaceHub {
  id: string;
  name: string;
  type: 'inspection_hub' | 'service_center' | 'rider_meetup' | 'ev_station';
  city: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  phone: string;
  imageUrl: string;
}

export interface ResaleUpgradeItem {
  id: string;
  title: string;
  category: 'cosmetic' | 'mechanical' | 'comfort' | 'accessories' | 'trust';
  cost: number;
  estimatedRoiMultiplier: number;
  estimatedResaleGain: number;
  difficulty: 'DIY' | 'Partner Workshop';
  recommended: boolean;
  reason: string;
}

export interface FilterOptions {
  category: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  maxKm: number;
  fuel: string;
  owners: string;
  verifiedOnly: boolean;
  radiusKm: number;
  sortBy: 'distance' | 'price_low' | 'price_high' | 'year_new' | 'relevance';
}
