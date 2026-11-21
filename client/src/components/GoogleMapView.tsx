import React, { useEffect, useRef, useState } from 'react';
import { VehicleListing, SearchCenter } from '../types';
import { formatINR } from '../utils/geo';
import { Compass, MapPin, Eye, Zap, AlertCircle } from 'lucide-react';

interface GoogleMapViewProps {
  vehicles: VehicleListing[];
  searchCenter: SearchCenter;
  radiusKm: number;
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string) => void;
  onMapCenterChange: (lat: number, lng: number) => void;
  className?: string;
}

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  vehicles,
  searchCenter,
  radiusKm,
  selectedVehicleId,
  onSelectVehicle,
  onMapCenterChange,
  className = 'h-full w-full',
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const centerMarkerRef = useRef<google.maps.Marker | null>(null);
  const radiusCircleRef = useRef<google.maps.Circle | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Initialize Google Map with standard Clean Light Styling
  useEffect(() => {
    if (!mapContainerRef.current || !window.google?.maps) return;

    if (!mapInstanceRef.current) {
      const map = new google.maps.Map(mapContainerRef.current, {
        center: { lat: searchCenter.lat, lng: searchCenter.lng },
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: true,
        fullscreenControl: true,
      });

      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          onMapCenterChange(e.latLng.lat(), e.latLng.lng());
        }
      });

      infoWindowRef.current = new google.maps.InfoWindow();
      mapInstanceRef.current = map;
    }
  }, []);

  // Update Center and Pan smoothly
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google?.maps) return;

    mapInstanceRef.current.panTo({ lat: searchCenter.lat, lng: searchCenter.lng });

    // Update or create Center Beacon Marker
    if (centerMarkerRef.current) {
      centerMarkerRef.current.setPosition({ lat: searchCenter.lat, lng: searchCenter.lng });
    } else {
      centerMarkerRef.current = new google.maps.Marker({
        position: { lat: searchCenter.lat, lng: searchCenter.lng },
        map: mapInstanceRef.current,
        title: searchCenter.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: '#059669',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2.5,
        },
        zIndex: 999,
      });
    }

    // Update Radius Circle
    if (radiusCircleRef.current) {
      radiusCircleRef.current.setMap(null);
      radiusCircleRef.current = null;
    }

    if (radiusKm > 0) {
      radiusCircleRef.current = new google.maps.Circle({
        strokeColor: '#059669',
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: '#10B981',
        fillOpacity: 0.12,
        map: mapInstanceRef.current,
        center: { lat: searchCenter.lat, lng: searchCenter.lng },
        radius: radiusKm * 1000, // in meters
        clickable: false,
      });
    }
  }, [searchCenter, radiusKm]);

  // Update Vehicle Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google?.maps) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    vehicles.forEach((vehicle) => {
      const isSelected = vehicle.id === selectedVehicleId;
      const isEV = vehicle.category === 'electric';
      const isScooter = vehicle.category === 'scooter';

      const fillColor = isSelected
        ? '#047857'
        : isEV
        ? '#10B981'
        : isScooter
        ? '#065F46'
        : '#047857';

      const strokeColor = '#FFFFFF';
      const priceText = vehicle.price >= 100000 
        ? `₹${(vehicle.price / 100000).toFixed(1)}L` 
        : `₹${Math.round(vehicle.price / 1000)}k`;

      const marker = new google.maps.Marker({
        position: { lat: vehicle.lat, lng: vehicle.lng },
        map: mapInstanceRef.current,
        title: `${vehicle.title} - ${formatINR(vehicle.price)}`,
        label: {
          text: priceText,
          color: '#FFFFFF',
          fontSize: '11px',
          fontWeight: 'bold',
          className: 'google-map-marker-label',
        },
        icon: {
          path: 'M -28,-14 L 28,-14 A 14,14 0 0 1 28,14 L -28,14 A 14,14 0 0 1 -28,-14 Z',
          fillColor: fillColor,
          fillOpacity: 1,
          strokeColor: strokeColor,
          strokeWeight: isSelected ? 3 : 1.5,
          scale: 1,
          labelOrigin: new google.maps.Point(0, 0),
        },
        zIndex: isSelected ? 100 : 10,
      });

      marker.addListener('click', () => {
        onSelectVehicle(vehicle.id);

        if (infoWindowRef.current && mapInstanceRef.current) {
          const contentString = `
            <div style="background:#ffffff; color:#0f172a; border-radius:14px; overflow:hidden; font-family:'Plus Jakarta Sans', sans-serif; width:220px; box-shadow:0 12px 30px rgba(15,23,42,0.18);">
              <img src="${vehicle.primaryImage}" alt="${vehicle.title}" style="width:100%; height:110px; object-fit:cover;" />
              <div style="padding:10px 12px 12px 12px;">
                <div style="font-size:10px; color:#047857; text-transform:uppercase; font-weight:800;">
                  ${vehicle.category} • ${vehicle.distanceKm !== undefined ? vehicle.distanceKm + ' km away' : vehicle.city}
                </div>
                <div style="font-weight:700; font-size:13px; margin:4px 0; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                  ${vehicle.title}
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                  <span style="font-weight:800; font-size:14px; color:#047857;">
                    ${formatINR(vehicle.price)}
                  </span>
                  <a href="/bike/${vehicle.id}" style="background:#047857; color:#fff; font-size:11px; font-weight:700; padding:5px 10px; border-radius:6px; text-decoration:none;">
                    View Details &rarr;
                  </a>
                </div>
              </div>
            </div>
          `;
          infoWindowRef.current.setContent(contentString);
          infoWindowRef.current.open(mapInstanceRef.current, marker);
        }
      });

      markersRef.current.push(marker);
    });
  }, [vehicles, selectedVehicleId]);

  return (
    <div className={`relative ${className} rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-50`}>
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 text-[11px] text-slate-700 flex items-center gap-3 shadow-md pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-forest-600"></span>
          <span className="font-semibold">Motorcycle</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-forest-800"></span>
          <span className="font-semibold">Scooter</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span className="font-semibold">Electric EV</span>
        </div>
      </div>

      {/* Helper Badge */}
      <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] text-slate-700 shadow-md hidden sm:block pointer-events-none">
        📍 Google Maps Platform Active • Tap to set search center
      </div>
    </div>
  );
};