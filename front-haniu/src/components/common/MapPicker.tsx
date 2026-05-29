'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface MapPickerProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number, address: string) => void;
}

export default function MapPicker({ lat, lng, onLocationChange }: MapPickerProps) {
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastCoordsRef = useRef({ lat, lng });

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
      marker.bindPopup("📍 Đang xác định vị trí...").openPopup();
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=vi`,
        { headers: { 'Accept-Language': 'vi' } }
      )
        .then((res) => res.json())
        .then((data) => {
          const addr = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          marker.bindPopup(`<b>📍 Địa chỉ giao hàng:</b><br><span style="font-size: 11px; color: #555;">${addr}</span>`).openPopup();
        })
        .catch(() => {
          marker.bindPopup("<b>📍 Vị trí giao hàng</b><br>Kéo thả ghim này để chọn địa chỉ chính xác").openPopup();
        });
      markerRef.current = marker;
      mapRef.current = map;

      // Close popup when dragging starts
      marker.on('dragstart', () => {
        marker.closePopup();
      });

      // On drag end, reverse geocode
      marker.on('dragend', async () => {
        const pos = marker.getLatLng();
        lastCoordsRef.current = { lat: pos.lat, lng: pos.lng };
        marker.bindPopup("📍 Đang tìm địa chỉ...").openPopup();
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
          
          marker.bindPopup(`<b>📍 Địa chỉ giao hàng:</b><br><span style="font-size: 11px; color: #555;">${addr}</span>`).openPopup();
          onLocationChange(pos.lat, pos.lng, shortAddr);
        } catch {
          marker.bindPopup("📍 Không xác định được địa chỉ").openPopup();
          onLocationChange(pos.lat, pos.lng, '');
        }
      });

      // Click on map to move marker
      map.on('click', async (e: any) => {
        marker.setLatLng(e.latlng);
        lastCoordsRef.current = { lat: e.latlng.lat, lng: e.latlng.lng };
        marker.bindPopup("📍 Đang tìm địa chỉ...").openPopup();
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}&accept-language=vi`,
            { headers: { 'Accept-Language': 'vi' } }
          );
          const data = await res.json();
          const parts = [];
          if (data.address?.house_number) parts.push(data.address.house_number);
          if (data.address?.road) parts.push(data.address.road);
          if (data.address?.quarter) parts.push(data.address.quarter);
          const shortAddr = parts.length > 0 ? parts.join(' ') : '';
          
          marker.bindPopup(`<b>📍 Địa chỉ giao hàng:</b><br><span style="font-size: 11px; color: #555;">${data.display_name || "Vị trí đã chọn"}</span>`).openPopup();
          onLocationChange(e.latlng.lat, e.latlng.lng, shortAddr);
        } catch {
          marker.bindPopup("📍 Không xác định được địa chỉ").openPopup();
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
    if (lat === lastCoordsRef.current.lat && lng === lastCoordsRef.current.lng) {
      return;
    }

    lastCoordsRef.current = { lat, lng };

    if (markerRef.current && mapRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      mapRef.current.setView([lat, lng], 15);
      markerRef.current.bindPopup("📍 Đang tìm địa chỉ...").openPopup();
      
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=vi`,
        { headers: { 'Accept-Language': 'vi' } }
      )
        .then(res => res.json())
        .then(data => {
          const addr = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          markerRef.current.bindPopup(`<b>📍 Địa chỉ giao hàng:</b><br><span style="font-size: 11px; color: #555;">${addr}</span>`).openPopup();
        })
        .catch(() => {
          markerRef.current.bindPopup("<b>📍 Vị trí giao hàng</b><br>Kéo thả ghim này để chọn địa chỉ chính xác").openPopup();
        });
    }
  }, [lat, lng]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[220px] sm:h-[320px] rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-700 z-0"
      style={{ isolation: 'isolate' }}
    />
  );
}
