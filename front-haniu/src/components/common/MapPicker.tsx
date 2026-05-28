'use client';

import { useEffect, useRef } from 'react';

interface MapPickerProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number, address: string) => void;
}

export default function MapPicker({ lat, lng, onLocationChange }: MapPickerProps) {
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamic import Leaflet only on client
    import('leaflet').then((L) => {
      // Fix default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      if (!containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
      markerRef.current = marker;
      mapRef.current = map;

      // On drag end, reverse geocode
      marker.on('dragend', async () => {
        const pos = marker.getLatLng();
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.lat}&lon=${pos.lng}&accept-language=vi`,
            { headers: { 'Accept-Language': 'vi' } }
          );
          const data = await res.json();
          const addr = data.display_name || `${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}`;
          // Extract street-level address (house number + road)
          const parts = [];
          if (data.address?.house_number) parts.push(data.address.house_number);
          if (data.address?.road) parts.push(data.address.road);
          if (data.address?.quarter) parts.push(data.address.quarter);
          const shortAddr = parts.length > 0 ? parts.join(' ') : addr;
          onLocationChange(pos.lat, pos.lng, shortAddr);
        } catch {
          onLocationChange(pos.lat, pos.lng, '');
        }
      });

      // Click on map to move marker
      map.on('click', async (e: any) => {
        marker.setLatLng(e.latlng);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`,
            { headers: { 'Accept-Language': 'vi' } }
          );
          const data = await res.json();
          const parts = [];
          if (data.address?.house_number) parts.push(data.address.house_number);
          if (data.address?.road) parts.push(data.address.road);
          if (data.address?.quarter) parts.push(data.address.quarter);
          const shortAddr = parts.length > 0 ? parts.join(' ') : '';
          onLocationChange(e.latlng.lat, e.latlng.lng, shortAddr);
        } catch {
          onLocationChange(e.latlng.lat, e.latlng.lng, '');
        }
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);  // Only init once

  // Update marker when lat/lng props change externally
  useEffect(() => {
    if (markerRef.current && mapRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      mapRef.current.setView([lat, lng], 15);
    }
  }, [lat, lng]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[280px] rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-700 z-0"
      style={{ isolation: 'isolate' }}
    />
  );
}
