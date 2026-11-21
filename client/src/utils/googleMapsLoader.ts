// ==============================================================================
// Google Maps JavaScript API Loader with Error Handling & Fallback
// ==============================================================================

let isGoogleMapsLoading = false;
let isGoogleMapsLoaded = false;
let googleMapsLoadError: string | null = null;
const loadCallbacks: Array<(error: string | null) => void> = [];

export function getGoogleMapsApiKey(): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metaEnv = (import.meta as any)?.env || {};
  const viteKey = metaEnv.VITE_GOOGLE_MAPS_API_KEY;
  const nextKey = metaEnv.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const key = viteKey || nextKey || '';
  // Avoid placeholder strings
  if (key === 'your_google_maps_api_key_here' || key.trim() === '') {
    return '';
  }
  return key.trim();
}

export function loadGoogleMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isGoogleMapsLoaded && window.google?.maps) {
      resolve();
      return;
    }

    if (googleMapsLoadError) {
      reject(new Error(googleMapsLoadError));
      return;
    }

    loadCallbacks.push((err) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve();
      }
    });

    if (isGoogleMapsLoading) {
      return;
    }

    isGoogleMapsLoading = true;

    // Check if script already in document
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      if (window.google?.maps) {
        isGoogleMapsLoaded = true;
        isGoogleMapsLoading = false;
        resolve();
        return;
      }
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.type = 'text/javascript';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isGoogleMapsLoaded = true;
      isGoogleMapsLoading = false;
      loadCallbacks.forEach((cb) => cb(null));
      loadCallbacks.length = 0;
    };

    script.onerror = () => {
      googleMapsLoadError = 'Failed to load Google Maps script. Check your API key or network connection.';
      isGoogleMapsLoading = false;
      loadCallbacks.forEach((cb) => cb(googleMapsLoadError));
      loadCallbacks.length = 0;
    };

    document.head.appendChild(script);
  });
}
