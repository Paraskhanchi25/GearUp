import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { VehicleListing, SearchCenter, MapTileLayerType } from '../types';
import { formatINR, POPULAR_INDIAN_HUBS } from '../utils/geo';
import { INDIAN_BOUNDARIES_GEOJSON } from '../data/boundariesGeoJSON';
import { 
  Map as MapIcon, 
  PenTool, 
  Check, 
  X, 
  Search, 
  Globe, 
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';

// Fix Leaflet default marker assets for standard bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Tile Provider Configurations
const TILE_CONFIG = {
  roadmap: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    maxZoom: 19,
    minZoom: 2,
    subdomains: ['a', 'b', 'c'],
    fallbackUrl: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics',
    maxZoom: 19,
    minZoom: 2,
    boundariesPlacesUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    transportationUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
  },
};

// Create Custom Vehicle Marker HTML (Clean Light Luxury Automotive Styling)
const createVehicleDivIcon = (category: string, isSelected: boolean, price: number) => {
  let iconSvg = '';
  let colorClass = isSelected
    ? 'bg-forest-600 text-white ring-4 ring-forest-400/40 shadow-xl scale-110'
    : 'bg-white text-slate-900 border-2 border-forest-600 shadow-md hover:border-forest-700 hover:scale-105';

  if (category === 'motorcycle') {
    iconSvg = `<svg class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6h-3l-3 6.5h7.5"/><path d="M19 17.5l-2.5-6h-4"/></svg>`;
  } else if (category === 'electric') {
    colorClass = isSelected
      ? 'bg-emerald-600 text-white ring-4 ring-emerald-400/40 shadow-xl scale-110'
      : 'bg-white text-emerald-700 border-2 border-emerald-500 shadow-md hover:border-emerald-600 hover:scale-105';
    iconSvg = `<svg class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
  } else {
    // Scooter
    iconSvg = `<svg class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M9 17h6"/><path d="M12 17V8l4-2"/></svg>`;
  }

  const priceFormatted =
    price >= 100000 ? `${(price / 100000).toFixed(1)}L` : `${Math.round(price / 1000)}k`;

  return L.divIcon({
    className: 'custom-vehicle-marker-div',
    html: `
      <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-sans transition-all duration-200 cursor-pointer ${colorClass}">
        ${iconSvg}
        <span class="text-[11px] font-black tracking-tight whitespace-nowrap">₹${priceFormatted}</span>
      </div>
    `,
    iconSize: [76, 28],
    iconAnchor: [38, 14],
  });
};

// Search Center Origin Beacon Icon
const centerBeaconIcon = L.divIcon({
  className: 'custom-center-beacon-div',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-8 h-8 rounded-full bg-forest-500 opacity-60 animate-ping"></div>
      <div class="w-4 h-4 rounded-full bg-forest-600 border-2 border-white shadow-md"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Polygon Vertex Handle Icon
const polygonVertexIcon = L.divIcon({
  className: 'polygon-vertex-dot',
  html: `<div class="w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white shadow-md"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

interface InteractiveMapProps {
  vehicles: VehicleListing[];
  searchCenter: SearchCenter;
  radiusKm: number;
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string) => void;
  onMapCenterChange: (lat: number, lng: number) => void;
  polygonCoords?: [number, number][];
  onPolygonChange?: (coords: [number, number][]) => void;
  onClearPolygon?: () => void;
  className?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  vehicles,
  searchCenter,
  radiusKm,
  selectedVehicleId,
  onSelectVehicle,
  onMapCenterChange,
  polygonCoords = [],
  onPolygonChange,
  onClearPolygon,
  className = 'h-full w-full',
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const satelliteOverlaysRef = useRef<L.Layer[]>([]);
  const boundariesGeoJsonRef = useRef<L.GeoJSON | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const circleLayerRef = useRef<L.Circle | null>(null);
  const centerMarkerRef = useRef<L.Marker | null>(null);
  const polygonLayerRef = useRef<L.Polygon | null>(null);
  const polygonVertexMarkersRef = useRef<L.Marker[]>([]);

  // State
  const [activeLayer, setActiveLayer] = useState<MapTileLayerType>('roadmap');
  const [isLoadingTiles, setIsLoadingTiles] = useState<boolean>(false);
  const [isDrawingPolygon, setIsDrawingPolygon] = useState<boolean>(false);
  const [currentPolygonPoints, setCurrentPolygonPoints] = useState<[number, number][]>(polygonCoords);
  const [addressSearch, setAddressSearch] = useState<string>('');
  const [layerError, setLayerError] = useState<string | null>(null);

  // Synchronize incoming polygonCoords
  useEffect(() => {
    setCurrentPolygonPoints(polygonCoords);
  }, [polygonCoords]);

  // Remove satellite-only overlays
  const clearSatelliteOverlays = useCallback(() => {
    if (!mapInstanceRef.current) return;
    satelliteOverlaysRef.current.forEach((layer) => {
      try {
        mapInstanceRef.current?.removeLayer(layer);
      } catch (err) {
        // ignore removal error
      }
    });
    satelliteOverlaysRef.current = [];
  }, []);

  // Update or render Geographic Boundaries GeoJSON with layer-specific contrast
  const applyBoundariesGeoJson = useCallback((map: L.Map, layerType: MapTileLayerType) => {
    if (boundariesGeoJsonRef.current) {
      try {
        map.removeLayer(boundariesGeoJsonRef.current);
      } catch (e) {}
      boundariesGeoJsonRef.current = null;
    }

    const isSatellite = layerType === 'satellite';
    const geoJsonLayer = L.geoJSON(INDIAN_BOUNDARIES_GEOJSON as any, {
      style: {
        color: isSatellite ? '#38BDF8' : '#059669', // Sky-cyan on Satellite, Forest-emerald on Roadmap
        weight: 1.8,
        dashArray: '5, 5',
        fillColor: isSatellite ? '#38BDF8' : '#10B981',
        fillOpacity: isSatellite ? 0.06 : 0.03,
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties && feature.properties.name) {
          layer.bindTooltip(feature.properties.name, {
            permanent: true,
            direction: 'center',
            className: 'boundary-area-label',
          });
        }
      },
    }).addTo(map);

    boundariesGeoJsonRef.current = geoJsonLayer;
  }, []);

  // Switch Tile Layer: Preserves center & zoom, removes previous base layer cleanly, prevents duplicates
  const setMapTileLayer = useCallback((layer: MapTileLayerType) => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    setLayerError(null);
    setIsLoadingTiles(true);

    // 1. Remove previous base tile layer
    if (tileLayerRef.current) {
      try {
        map.removeLayer(tileLayerRef.current);
      } catch (e) {}
      tileLayerRef.current = null;
    }

    // 2. Clear satellite-only overlays
    clearSatelliteOverlays();

    if (layer === 'satellite') {
      // Esri World Imagery Base
      const esriSatellite = L.tileLayer(TILE_CONFIG.satellite.url, {
        attribution: TILE_CONFIG.satellite.attribution,
        maxZoom: TILE_CONFIG.satellite.maxZoom,
        minZoom: TILE_CONFIG.satellite.minZoom,
      });

      esriSatellite.on('loading', () => setIsLoadingTiles(true));
      esriSatellite.on('load', () => setIsLoadingTiles(false));
      esriSatellite.on('tileerror', () => {
        setIsLoadingTiles(false);
        setLayerError('Satellite imagery timed out. You can switch to Roadmap.');
      });

      esriSatellite.addTo(map);
      tileLayerRef.current = esriSatellite;

      // Esri World Boundaries & Places reference overlay
      const boundariesPlacesOverlay = L.tileLayer(TILE_CONFIG.satellite.boundariesPlacesUrl, {
        attribution: 'Boundaries &amp; Places &copy; Esri',
        maxZoom: 19,
        opacity: 0.95,
      }).addTo(map);

      // Esri World Transportation reference overlay (Roads, Highways)
      const transportationOverlay = L.tileLayer(TILE_CONFIG.satellite.transportationUrl, {
        attribution: 'Roads &amp; Highways &copy; Esri, HERE',
        maxZoom: 19,
        opacity: 0.85,
      }).addTo(map);

      satelliteOverlaysRef.current = [boundariesPlacesOverlay, transportationOverlay];
    } else {
      // Roadmap: OpenStreetMap Base (https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png)
      const osmRoadmap = L.tileLayer(TILE_CONFIG.roadmap.url, {
        attribution: TILE_CONFIG.roadmap.attribution,
        maxZoom: TILE_CONFIG.roadmap.maxZoom,
        minZoom: TILE_CONFIG.roadmap.minZoom,
        subdomains: TILE_CONFIG.roadmap.subdomains,
      });

      osmRoadmap.on('loading', () => setIsLoadingTiles(true));
      osmRoadmap.on('load', () => setIsLoadingTiles(false));
      osmRoadmap.on('tileerror', () => {
        setIsLoadingTiles(false);
        // Fallback to secondary Carto CDN mirror if OSM has temporary rate limit
        console.warn('OSM tile error, activating backup mirror');
        if (tileLayerRef.current) {
          try {
            map.removeLayer(tileLayerRef.current);
          } catch (e) {}
        }
        const fallback = L.tileLayer(TILE_CONFIG.roadmap.fallbackUrl, {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          maxZoom: 19,
        }).addTo(map);
        tileLayerRef.current = fallback;
      });

      osmRoadmap.addTo(map);
      tileLayerRef.current = osmRoadmap;
    }

    // 3. Apply boundaries and labels for the active layer
    applyBoundariesGeoJson(map, layer);

    setActiveLayer(layer);
  }, [clearSatelliteOverlays, applyBoundariesGeoJson]);

  // Initialize Map Once with Clean Lifecycle
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Prevent duplicate map instances in React StrictMode
    if ((mapContainerRef.current as any)._leaflet_id) {
      delete (mapContainerRef.current as any)._leaflet_id;
    }

    const map = L.map(mapContainerRef.current, {
      center: [searchCenter.lat, searchCenter.lng],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Default: OpenStreetMap Roadmap Layer
    const initialTileLayer = L.tileLayer(TILE_CONFIG.roadmap.url, {
      attribution: TILE_CONFIG.roadmap.attribution,
      maxZoom: TILE_CONFIG.roadmap.maxZoom,
      minZoom: TILE_CONFIG.roadmap.minZoom,
      subdomains: TILE_CONFIG.roadmap.subdomains,
    });

    initialTileLayer.on('loading', () => setIsLoadingTiles(true));
    initialTileLayer.on('load', () => setIsLoadingTiles(false));
    initialTileLayer.on('tileerror', () => {
      setIsLoadingTiles(false);
      console.warn('Initial OSM tile load issue, trying backup mirror');
      if (tileLayerRef.current) {
        try {
          map.removeLayer(tileLayerRef.current);
        } catch (e) {}
      }
      const fallback = L.tileLayer(TILE_CONFIG.roadmap.fallbackUrl, {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);
      tileLayerRef.current = fallback;
    });

    initialTileLayer.addTo(map);
    tileLayerRef.current = initialTileLayer;

    // Apply Boundaries & Labels to Roadmap
    applyBoundariesGeoJson(map, 'roadmap');

    // Create Layer Groups
    markersLayerRef.current = L.layerGroup().addTo(map);

    // Map Click Handler (Supports Search Center Relocation and Polygon Drawing)
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      if ((map as any)._isDrawingActive) {
        (map as any)._addPolygonPoint?.(lat, lng);
      } else {
        onMapCenterChange(lat, lng);
      }
    });

    mapInstanceRef.current = map;

    // Window / container resize observer to ensure smooth rendering
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.off();
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
      markersLayerRef.current = null;
      circleLayerRef.current = null;
      centerMarkerRef.current = null;
      polygonLayerRef.current = null;
      boundariesGeoJsonRef.current = null;
      satelliteOverlaysRef.current = [];
    };
  }, []);

  // Expose Polygon Point Adder to Map Instance
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    (mapInstanceRef.current as any)._isDrawingActive = isDrawingPolygon;
    (mapInstanceRef.current as any)._addPolygonPoint = (lat: number, lng: number) => {
      setCurrentPolygonPoints((prev) => [...prev, [lat, lng]]);
    };
  }, [isDrawingPolygon]);

  // Update Search Center & Radius Circle
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    map.panTo([searchCenter.lat, searchCenter.lng], { animate: true });

    // Update Center Beacon
    if (centerMarkerRef.current) {
      centerMarkerRef.current.setLatLng([searchCenter.lat, searchCenter.lng]);
    } else {
      centerMarkerRef.current = L.marker([searchCenter.lat, searchCenter.lng], {
        icon: centerBeaconIcon,
        zIndexOffset: 1000,
      }).addTo(map);

      centerMarkerRef.current.bindPopup(`
        <div style="font-family:'Plus Jakarta Sans',sans-serif; font-size:11px; padding:4px;">
          <strong style="color:#059669;">Search Center Origin</strong>
          <p style="margin:2px 0 0 0; color:#334155;">${searchCenter.name}</p>
        </div>
      `);
    }

    // Update Radius Circle (only if not drawing custom polygon and radius > 0)
    if (circleLayerRef.current) {
      map.removeLayer(circleLayerRef.current);
      circleLayerRef.current = null;
    }

    if (radiusKm > 0 && currentPolygonPoints.length === 0) {
      circleLayerRef.current = L.circle([searchCenter.lat, searchCenter.lng], {
        radius: radiusKm * 1000, // in meters
        color: '#059669',
        fillColor: '#10B981',
        fillOpacity: 0.12,
        weight: 2,
        dashArray: '5, 8',
      }).addTo(map);
    }
  }, [searchCenter, radiusKm, currentPolygonPoints.length]);

  // Update Custom Polygon Overlay
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear old polygon and vertex dots
    if (polygonLayerRef.current) {
      map.removeLayer(polygonLayerRef.current);
      polygonLayerRef.current = null;
    }
    polygonVertexMarkersRef.current.forEach((m) => map.removeLayer(m));
    polygonVertexMarkersRef.current = [];

    if (currentPolygonPoints.length > 0) {
      polygonLayerRef.current = L.polygon(currentPolygonPoints, {
        color: '#D97706',
        fillColor: '#F59E0B',
        fillOpacity: 0.18,
        weight: 2.5,
        dashArray: isDrawingPolygon ? '6, 6' : undefined,
      }).addTo(map);

      if (isDrawingPolygon) {
        currentPolygonPoints.forEach((pt) => {
          const dot = L.marker(pt, { icon: polygonVertexIcon, interactive: false }).addTo(map);
          polygonVertexMarkersRef.current.push(dot);
        });
      }
    }
  }, [currentPolygonPoints, isDrawingPolygon]);

  // Update Vehicle Markers (Clean Light Automotive Cards)
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const layer = markersLayerRef.current;
    layer.clearLayers();

    vehicles.forEach((vehicle) => {
      const isSelected = vehicle.id === selectedVehicleId;
      const markerIcon = createVehicleDivIcon(vehicle.category, isSelected, vehicle.price);

      const marker = L.marker([vehicle.lat, vehicle.lng], {
        icon: markerIcon,
        zIndexOffset: isSelected ? 500 : 10,
      });

      marker.on('click', () => {
        onSelectVehicle(vehicle.id);
      });

      // Clean White Card Popup matching the reference design
      marker.bindPopup(`
        <div style="background:#ffffff; color:#0f172a; border-radius:14px; overflow:hidden; font-family:'Plus Jakarta Sans',sans-serif; width:224px; box-shadow:0 12px 30px rgba(15,23,42,0.18);">
          <div style="position:relative; width:100%; height:116px; overflow:hidden;">
            <img src="${vehicle.primaryImage}" alt="${vehicle.title}" style="width:100%; height:100%; object-fit:cover;" />
            <div style="position:absolute; top:8px; left:8px; background:rgba(255,255,255,0.92); color:#047857; font-size:9px; font-weight:800; text-transform:uppercase; padding:3px 7px; border-radius:6px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
              ${vehicle.category}
            </div>
            ${vehicle.distanceKm !== undefined ? `
              <div style="position:absolute; bottom:8px; right:8px; background:rgba(15,23,42,0.85); color:#ffffff; font-size:9px; font-weight:700; padding:2px 6px; border-radius:5px;">
                ${vehicle.distanceKm} km away
              </div>
            ` : ''}
          </div>
          <div style="padding:10px 12px 12px 12px;">
            <div style="font-weight:700; font-size:13px; line-height:1.3; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${vehicle.title}
            </div>
            <div style="font-size:11px; color:#64748b; margin-top:2px;">
              ${vehicle.year} • ${(vehicle.km || 0).toLocaleString()} km • ${vehicle.city}
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; padding-top:8px; border-top:1px solid #f1f5f9;">
              <div>
                <span style="font-size:9px; color:#64748b; text-transform:uppercase; display:block; font-weight:600;">Price</span>
                <span style="font-weight:800; font-size:15px; color:#047857;">
                  ${formatINR(vehicle.price)}
                </span>
              </div>
              <a href="/bike/${vehicle.id}" style="background:#047857; color:#ffffff; font-size:11px; font-weight:700; padding:6px 12px; border-radius:8px; text-decoration:none; display:inline-flex; align-items:center; gap:4px; box-shadow:0 2px 6px rgba(4,120,87,0.3);">
                View Details &rarr;
              </a>
            </div>
          </div>
        </div>
      `, {
        className: 'gearup-leaflet-popup',
        maxWidth: 240,
      });

      layer.addLayer(marker);
    });
  }, [vehicles, selectedVehicleId, onSelectVehicle]);

  // Finish Polygon Drawing
  const handleFinishPolygon = () => {
    if (currentPolygonPoints.length < 3) {
      alert('A polygon search area requires at least 3 points. Tap more locations on the map.');
      return;
    }
    setIsDrawingPolygon(false);
    onPolygonChange?.(currentPolygonPoints);
  };

  // Clear Polygon
  const handleClearPolygon = () => {
    setCurrentPolygonPoints([]);
    setIsDrawingPolygon(false);
    onClearPolygon?.();
  };

  // Address Search inside Map
  const handleAddressSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressSearch.trim()) return;

    const matchedHub = POPULAR_INDIAN_HUBS.find(h =>
      h.name.toLowerCase().includes(addressSearch.toLowerCase()) ||
      h.city.toLowerCase().includes(addressSearch.toLowerCase())
    );

    if (matchedHub) {
      onMapCenterChange(matchedHub.lat, matchedHub.lng);
      setAddressSearch('');
    } else {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressSearch + ', India')}&limit=1`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            onMapCenterChange(parseFloat(data[0].lat), parseFloat(data[0].lon));
            setAddressSearch('');
          } else {
            alert('Location not found. Please click your sector or city directly on the map.');
          }
        })
        .catch(() => alert('Search offline. Tap on the map to set search center.'));
    }
  };

  return (
    <div className={`relative ${className} rounded-2xl overflow-hidden border border-slate-200/90 shadow-xl bg-slate-50`}>
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Left: Layer Selector (Roadmap: OpenStreetMap / Satellite: Esri World Imagery) */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-md text-xs font-semibold">
        <button
          onClick={() => setMapTileLayer('roadmap')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
            activeLayer === 'roadmap'
              ? 'bg-forest-600 text-white shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="OpenStreetMap: Roads, cities, landmarks and district boundaries"
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>Roadmap (OSM)</span>
        </button>

        <button
          onClick={() => setMapTileLayer('satellite')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
            activeLayer === 'satellite'
              ? 'bg-forest-600 text-white shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Esri World Imagery with reference boundaries & transportation"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Satellite (Esri)</span>
        </button>
      </div>

      {/* Center Top: Loading Indicator while tiles load */}
      {isLoadingTiles && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 shadow-md text-xs font-semibold text-slate-700 animate-fade-in pointer-events-none">
          <Loader2 className="w-3.5 h-3.5 text-forest-600 animate-spin" />
          <span>Updating map tiles...</span>
        </div>
      )}

      {/* Top Right: Custom Polygon Drawing Toolbar */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-1.5">
        {!isDrawingPolygon ? (
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-md">
            <button
              onClick={() => {
                setCurrentPolygonPoints([]);
                setIsDrawingPolygon(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <PenTool className="w-3.5 h-3.5 text-amber-600" />
              <span>Draw Custom Area</span>
            </button>

            {currentPolygonPoints.length > 0 && (
              <button
                onClick={handleClearPolygon}
                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs transition-colors"
                title="Clear polygon boundary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-amber-400 shadow-lg animate-fade-in text-xs">
            <span className="text-amber-800 font-bold px-2">
              Tap map to add points ({currentPolygonPoints.length})
            </span>
            <button
              onClick={handleFinishPolygon}
              className="px-3 py-1 bg-forest-600 hover:bg-forest-700 rounded-lg text-white font-bold flex items-center gap-1 shadow-sm transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Finish Area</span>
            </button>
            <button
              onClick={() => {
                setIsDrawingPolygon(false);
                setCurrentPolygonPoints([]);
              }}
              className="p-1 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* In-Map Quick Search Bar */}
      <div className="absolute top-14 left-3 z-[400] max-w-xs w-full hidden sm:block">
        <form onSubmit={handleAddressSearch} className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-md text-xs">
          <Search className="w-3.5 h-3.5 text-forest-600 ml-1.5 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search locality or landmark..."
            value={addressSearch}
            onChange={(e) => setAddressSearch(e.target.value)}
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-[11px]"
          />
        </form>
      </div>

      {/* Tile Layer Notice or Error */}
      {layerError && (
        <div className="absolute bottom-16 left-4 right-4 z-[400] bg-amber-50 border border-amber-300 p-2.5 rounded-xl text-amber-900 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{layerError}</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMapTileLayer(activeLayer === 'roadmap' ? 'satellite' : 'roadmap')} 
              className="px-2.5 py-1 bg-amber-600 text-white rounded-lg font-bold text-[11px] shadow-sm hover:bg-amber-700"
            >
              Switch to {activeLayer === 'roadmap' ? 'Satellite' : 'Roadmap'}
            </button>
            <button onClick={() => setLayerError(null)} className="text-amber-800 font-bold ml-1">Dismiss</button>
          </div>
        </div>
      )}

      {/* Floating Legend */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 text-[11px] text-slate-700 flex items-center gap-3 shadow-md pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-forest-600 border border-forest-700"></span>
          <span className="font-semibold">Motorcycle</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-forest-800 border border-forest-900"></span>
          <span className="font-semibold">Scooter</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-600"></span>
          <span className="font-semibold">Electric EV</span>
        </div>
      </div>

      {/* Active State / Search Center Helper */}
      <div className="absolute bottom-4 right-4 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] text-slate-700 shadow-md hidden sm:block pointer-events-none">
        {currentPolygonPoints.length > 0 ? (
          <span className="text-amber-700 font-bold">⬡ Custom Polygon Area Filter Active</span>
        ) : (
          <span>📍 Tap map to relocate search center</span>
        )}
      </div>
    </div>
  );
};