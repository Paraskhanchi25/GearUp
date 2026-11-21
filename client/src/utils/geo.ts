// Accurate Haversine Distance Calculation between two Geographic Coordinates
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // 1 decimal place
}

// Ray-Casting Algorithm to test if a Coordinate is inside a Custom Polygon
export function isPointInPolygon(
  point: [number, number],
  polygon: [number, number][]
): boolean {
  if (polygon.length < 3) return true;
  const x = point[0];
  const y = point[1];
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// Indian Rupee (INR) Formatter with Indian numbering format
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null) return '₹0';
  return '₹' + amount.toLocaleString('en-IN');
}

export function formatINRLakh(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }
  return formatINR(amount);
}

// Standard Indian Metros and Hubs with accurate Lat/Lng
export const POPULAR_INDIAN_HUBS = [
  { name: 'Chandigarh (Sector 17)', city: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
  { name: 'Mohali (Phase 7)', city: 'Mohali', lat: 30.7046, lng: 76.7179 },
  { name: 'Panchkula (Sector 5)', city: 'Panchkula', lat: 30.6942, lng: 76.8606 },
  { name: 'Delhi NCR (Connaught Place)', city: 'Delhi', lat: 28.6315, lng: 77.2167 },
  { name: 'South Delhi (Saket)', city: 'Delhi', lat: 28.5245, lng: 77.2066 },
  { name: 'Bengaluru (Koramangala/Indiranagar)', city: 'Bengaluru', lat: 12.9352, lng: 77.6245 },
  { name: 'Pune (Kothrud/FC Road)', city: 'Pune', lat: 18.5167, lng: 73.8562 },
  { name: 'Mumbai (Bandra/Andheri)', city: 'Mumbai', lat: 19.0596, lng: 72.8295 },
  { name: 'Jaipur (MI Road)', city: 'Jaipur', lat: 26.9157, lng: 75.8189 },
];

// Reverse Geocode Latitude/Longitude into an Indian Address
// Uses OpenStreetMap Nominatim with intelligent local hub fallback
export async function reverseGeocodeLocation(
  lat: number,
  lng: number
): Promise<{ address: string; city: string; locality: string; landmark?: string }> {
  // Check known hub proximity first for instant offline responsiveness
  let closestHub = POPULAR_INDIAN_HUBS[0];
  let minDistance = 99999;
  for (const hub of POPULAR_INDIAN_HUBS) {
    const dist = calculateDistanceKm(lat, lng, hub.lat, hub.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestHub = hub;
    }
  }

  // Attempt Nominatim reverse geocode
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: { 'Accept-Language': 'en', 'User-Agent': 'GearUpTwoWheelerApp/1.0' },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const locality = addr.suburb || addr.neighbourhood || addr.residential || addr.road || closestHub.name;
      const city = addr.city || addr.town || addr.county || closestHub.city;
      const state = addr.state || 'India';
      const postcode = addr.postcode ? ` - ${addr.postcode}` : '';

      return {
        address: data.display_name ? data.display_name.split(',').slice(0, 3).join(',') + postcode : `${locality}, ${city}`,
        city: city,
        locality: locality,
        landmark: addr.amenity || addr.building || `Near ${closestHub.name}`,
      };
    }
  } catch (err) {
    console.debug('Reverse geocoding network fallback to nearest hub');
  }

  // Fallback to closest known hub with offset
  const latStr = lat.toFixed(4);
  const lngStr = lng.toFixed(4);
  return {
    address: `${closestHub.name}, ${closestHub.city} (${latStr}, ${lngStr})`,
    city: closestHub.city,
    locality: closestHub.name,
    landmark: `Near ${closestHub.name}`,
  };
}
