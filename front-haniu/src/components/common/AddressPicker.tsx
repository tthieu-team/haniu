'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import map — no SSR
const MapPicker = dynamic(() => import('./MapPicker'), { ssr: false, loading: () => (
  <div className="w-full h-[280px] rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
    <div className="text-xs text-slate-400 flex items-center gap-2">
      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      Đang tải bản đồ...
    </div>
  </div>
)});

// ── Types ──────────────────────────────────────────────────────────────────
interface Province { code: number; name: string; }
interface District { code: number; name: string; }
interface Ward    { code: number; name: string; }

interface AddressPickerProps {
  province: string;
  district: string;
  ward: string;
  addressLine: string;
  onChange: (fields: { province?: string; district?: string; ward?: string; addressLine?: string }) => void;
}

// ── Searchable Select ──────────────────────────────────────────────────────
function SearchSelect({
  label,
  value,
  options,
  placeholder,
  loading,
  disabled,
  onSelect,
}: {
  label: string;
  value: string;
  options: { code: number; name: string }[];
  placeholder: string;
  loading?: boolean;
  disabled?: boolean;
  onSelect: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const filtered = options.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (name: string) => {
    onSelect(name);
    setOpen(false);
    setSearch('');
  };

  return (
    <div className="relative" ref={ref}>
      <label className="text-xs text-slate-400 block mb-1 font-medium">{label}</label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={`w-full text-sm text-left px-3 py-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${
          disabled
            ? 'bg-slate-100 dark:bg-zinc-800/40 border-slate-200 dark:border-zinc-700 text-slate-400 cursor-not-allowed'
            : 'bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 hover:border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-slate-700 dark:text-white cursor-pointer'
        } ${open ? 'border-rose-500 ring-2 ring-rose-500/20' : ''}`}
      >
        <span className={value ? 'font-medium' : 'text-slate-400 dark:text-zinc-500 text-sm'}>
          {loading ? 'Đang tải...' : (value || placeholder)}
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl shadow-xl overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-slate-100 dark:border-zinc-800">
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full text-base md:text-xs px-3 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-rose-500 text-slate-700 dark:text-white placeholder:text-slate-400"
            />
          </div>
          {/* Options list */}
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Không tìm thấy kết quả</p>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => handleSelect(opt.name)}
                  className={`w-full text-left px-4 py-2.5 text-xs hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 transition-colors ${
                    value === opt.name
                      ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 font-bold'
                      : 'text-slate-700 dark:text-zinc-200'
                  }`}
                >
                  {opt.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main AddressPicker ─────────────────────────────────────────────────────
export default function AddressPicker({ province, district, ward, addressLine, onChange }: AddressPickerProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards]         = useState<Ward[]>([]);
  const [provinceCode, setProvinceCode] = useState<number | null>(null);
  const [districtCode, setDistrictCode] = useState<number | null>(null);

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards]         = useState(false);

  const [showMap, setShowMap] = useState(false);
  const [mapLat, setMapLat] = useState(21.0245); // Hanoi default
  const [mapLng, setMapLng] = useState(105.8412);
  const [gettingLocation, setGettingLocation] = useState(false);

  // ── Load provinces once ────────────────────────────────────────────────
  useEffect(() => {
    setLoadingProvinces(true);
    fetch('https://provinces.open-api.vn/api/?depth=1')
      .then((r) => r.json())
      .then((data: Province[]) => setProvinces(data))
      .catch(() => {})
      .finally(() => setLoadingProvinces(false));
  }, []);

  // ── Load districts when province changes ───────────────────────────────
  const handleProvinceSelect = useCallback(async (name: string) => {
    const found = provinces.find((p) => p.name === name);
    onChange({ province: name, district: '', ward: '' });
    setDistricts([]);
    setWards([]);
    setDistrictCode(null);
    if (!found) return;
    setProvinceCode(found.code);
    setLoadingDistricts(true);
    try {
      const res = await fetch(`https://provinces.open-api.vn/api/p/${found.code}?depth=2`);
      const data = await res.json();
      setDistricts(data.districts || []);
    } catch {}
    finally { setLoadingDistricts(false); }
  }, [provinces, onChange]);

  // ── Load wards when district changes ──────────────────────────────────
  const handleDistrictSelect = useCallback(async (name: string) => {
    const found = districts.find((d) => d.name === name);
    onChange({ district: name, ward: '' });
    setWards([]);
    if (!found) return;
    setDistrictCode(found.code);
    setLoadingWards(true);
    try {
      const res = await fetch(`https://provinces.open-api.vn/api/d/${found.code}?depth=2`);
      const data = await res.json();
      setWards(data.wards || []);
    } catch {}
    finally { setLoadingWards(false); }
  }, [districts, onChange]);

  // ── Auto-fill inputs from coordinates ──────────────────────────────────
  const autoFillFromCoords = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=vi`,
        { headers: { 'Accept-Language': 'vi' } }
      );
      const data = await res.json();
      if (!data || !data.address) return;

      const addr = data.address;
      console.log('📍 [Map Geocode] Address returned by Nominatim:', addr);
      console.log('📍 [Map Geocode] Full display name:', data.display_name);

      // 1. Get provinces list (ensure loaded)
      let activeProvinces = provinces;
      if (activeProvinces.length === 0) {
        const r = await fetch('https://provinces.open-api.vn/api/?depth=1');
        activeProvinces = await r.json();
        setProvinces(activeProvinces);
      }

      // Helper to clean and strip accents for highly robust comparison
      const clean = (name: string) => {
        if (!name) return '';
        return name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Strips all accents/diacritics
          .replace(/đ/g, 'd')             // Standardizes 'đ' to 'd'
          .replace(/^(tinh|thanh pho|quan|huyen|thi xa|thi tran|phuong|xa|tp\.|tp)\s+/gi, '')
          .trim();
      };

      // 2. Match Province
      const provName = addr.city || addr.state || addr.province || addr.region;
      console.log('📍 [Map Geocode] Province candidate from map:', provName);
      if (!provName) return;
      const cleanProv = clean(provName);
      const matchedProv = activeProvinces.find(
        (p) => clean(p.name).includes(cleanProv) || cleanProv.includes(clean(p.name))
      );
      console.log('📍 [Map Geocode] Matched Province in Database:', matchedProv);

      if (!matchedProv) return;

      // 3. Fetch Province Districts and Wards in a single tree request (depth=2)
      const distRes = await fetch(`https://provinces.open-api.vn/api/p/${matchedProv.code}?depth=2`);
      const distData = await distRes.json();
      const fetchedDistricts = distData.districts || [];
      setDistricts(fetchedDistricts);
      setProvinceCode(matchedProv.code);

      // Extract Ward candidate
      const wardName = addr.ward || addr.suburb || addr.quarter || addr.neighbourhood || addr.commune || addr.town || addr.village;
      console.log('📍 [Map Geocode] Ward candidate from map:', wardName);
      const cleanWard = wardName ? clean(wardName) : '';

      let matchedDist: any = undefined;
      let matchedWard: any = undefined;

      // 4. Match Ward first by searching using open-api.vn search endpoint (handles missing or wrong district fields in map data)
      if (cleanWard) {
        try {
          const wardSearchRes = await fetch(`https://provinces.open-api.vn/api/w/search/?q=${encodeURIComponent(cleanWard)}`);
          const matchedWardsList = await wardSearchRes.json();
          
          if (Array.isArray(matchedWardsList) && matchedWardsList.length > 0) {
            const activeDistrictCodes = new Set(fetchedDistricts.map((d: any) => d.code));
            // Find a ward in the list that belongs to our matched province by fetching details for the candidates
            const candidates = matchedWardsList.slice(0, 10);
            const detailedWards = await Promise.all(
              candidates.map(async (w: any) => {
                try {
                  const res = await fetch(`https://provinces.open-api.vn/api/w/${w.code}`);
                  return await res.json();
                } catch {
                  return null;
                }
              })
            );
            const foundWard = detailedWards.find((w: any) => w && activeDistrictCodes.has(w.district_code));
            if (foundWard) {
              matchedWard = foundWard;
              matchedDist = fetchedDistricts.find((d: any) => d.code === foundWard.district_code);
              console.log('📍 [Map Geocode] Matched via search API:', { ward: matchedWard.name, dist: matchedDist.name });
            }
          }
        } catch (e) {
          console.error('📍 [Map Geocode] Fuzzy search ward API failed, trying offline fallback', e);
        }
      }

      // SECONDARY WARD FALLBACK: If ward is still not found directly, scan road, neighbourhood, quarter, and display_name
      if (!matchedWard) {
        console.log('📍 [Map Geocode] Ward not matched directly, scanning road/display_name for fuzzy search...');
        try {
          const searchWord = clean(addr.road || addr.neighbourhood || addr.quarter || '');
          if (searchWord) {
            const wardSearchRes = await fetch(`https://provinces.open-api.vn/api/w/search/?q=${encodeURIComponent(searchWord)}`);
            const matchedWardsList = await wardSearchRes.json();
            if (Array.isArray(matchedWardsList) && matchedWardsList.length > 0) {
              const activeDistrictCodes = new Set(fetchedDistricts.map((d: any) => d.code));
              const candidates = matchedWardsList.slice(0, 10);
              const detailedWards = await Promise.all(
                candidates.map(async (w: any) => {
                  try {
                    const res = await fetch(`https://provinces.open-api.vn/api/w/${w.code}`);
                    return await res.json();
                  } catch {
                    return null;
                  }
                })
              );
              const foundWard = detailedWards.find((w: any) => w && activeDistrictCodes.has(w.district_code));
              if (foundWard) {
                matchedWard = foundWard;
                matchedDist = fetchedDistricts.find((d: any) => d.code === foundWard.district_code);
              }
            }
          }
        } catch (e) {
          console.error('📍 [Map Geocode] Secondary fuzzy search failed', e);
        }
      }

      // 5. Fallback: If District is still not matched (e.g. no ward matches), match district directly by name
      if (!matchedDist) {
        const distName = addr.city_district || addr.district || addr.county || addr.suburb;
        console.log('📍 [Map Geocode] Fallback: matching district directly by name:', distName);
        const cleanDist = distName ? clean(distName) : '';
        matchedDist = cleanDist
          ? fetchedDistricts.find((d: any) => clean(d.name).includes(cleanDist) || cleanDist.includes(clean(d.name)))
          : undefined;
      }

      // 6. Load Wards options for the UI dropdown based on matched district
      if (matchedDist) {
        const wardRes = await fetch(`https://provinces.open-api.vn/api/d/${matchedDist.code}?depth=2`);
        const wardData = await wardRes.json();
        const fetchedWards = wardData.wards || [];
        setWards(fetchedWards);
        setDistrictCode(matchedDist.code);
        
        // If we matched the district but matchedWard is still undefined, match within its fetched wards list
        if (!matchedWard && cleanWard) {
          matchedWard = fetchedWards.find((w: any) => clean(w.name).includes(cleanWard) || cleanWard.includes(clean(w.name)));
        }
      }

      console.log('📍 [Map Geocode] Matched District in Database:', matchedDist);
      console.log('📍 [Map Geocode] Matched Ward in Database:', matchedWard);

      // 5. Construct highly detailed address line by filtering components of display_name
      // This preserves specific locations like building name, street name, and local landmarks in correct order
      let cleanDetail = '';
      if (data.display_name) {
        const parts = data.display_name.split(',').map((p: string) => p.trim());
        const matchedWardClean = matchedWard ? clean(matchedWard.name) : '';
        const matchedDistClean = matchedDist ? clean(matchedDist.name) : '';
        const matchedProvClean = clean(matchedProv.name);
        
        const filteredParts = parts.filter((part: string) => {
          const cPart = clean(part);
          if (!cPart) return false;
          if (matchedWardClean && (cPart === matchedWardClean || matchedWardClean.includes(cPart) || cPart.includes(matchedWardClean))) return false;
          if (matchedDistClean && (cPart === matchedDistClean || matchedDistClean.includes(cPart) || cPart.includes(matchedDistClean))) return false;
          if (matchedProvClean && (cPart === matchedProvClean || matchedProvClean.includes(cPart) || cPart.includes(matchedProvClean))) return false;
          if (cPart === 'viet nam' || cPart === 'vietnam') return false;
          if (/^\d{5,6}$/.test(cPart)) return false;
          return true;
        });
        
        cleanDetail = filteredParts.join(', ');
      }

      // Fallback if no specific building or street info is available from display_name
      if (!cleanDetail) {
        const detailParts = [];
        const buildingName = addr.building || addr.amenity || addr.shop || addr.office || addr.apartment;
        if (buildingName) detailParts.push(buildingName);
        if (addr.house_number) detailParts.push(addr.house_number);
        
        const roadName = addr.road || addr.highway || addr.street;
        if (roadName) detailParts.push(roadName);
        cleanDetail = detailParts.join(' ');
      }

      console.log('📍 [Map Geocode] Final autofill payload:', {
        province: matchedProv.name,
        district: matchedDist ? matchedDist.name : '',
        ward: matchedWard ? matchedWard.name : '',
        addressLine: cleanDetail
      });

      onChange({
        province: matchedProv.name,
        district: matchedDist ? matchedDist.name : '',
        ward: matchedWard ? matchedWard.name : '',
        addressLine: cleanDetail
      });
    } catch (err) {
      console.error('Failed to reverse geocode and autofill', err);
    }
  };

  // ── Use browser GPS to center map ──────────────────────────────────────
  const handleGetMyLocation = () => {
    if (!navigator.geolocation) return;
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMapLat(pos.coords.latitude);
        setMapLng(pos.coords.longitude);
        setShowMap(true);
        setGettingLocation(false);
        autoFillFromCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => { setGettingLocation(false); setShowMap(true); },
      {
        enableHighAccuracy: true, // Enables GPS / cellular / Wi-Fi triangulation for best accuracy
        timeout: 8000,            // Time to wait before timing out (8 seconds)
        maximumAge: 0             // Do not use cached position
      }
    );
  };

  // ── Map: marker drag/click callback ───────────────────────────────────
  const handleMapLocationChange = (lat: number, lng: number, addr: string) => {
    setMapLat(lat);
    setMapLng(lng);
    autoFillFromCoords(lat, lng);
  };

  // ── Auto-locate on mount if address fields are empty ───────────────────
  useEffect(() => {
    const isEmpty = !province && !district && !ward && !addressLine;
    if (isEmpty && navigator.geolocation) {
      const timer = setTimeout(() => {
        handleGetMyLocation();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, []); // Only run once on component mount

  return (
    <div className="sm:col-span-2 space-y-4">
      {/* Province / District / Ward row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SearchSelect
          label="Tỉnh / Thành phố *"
          value={province}
          options={provinces}
          placeholder="Chọn tỉnh / thành phố"
          loading={loadingProvinces}
          onSelect={handleProvinceSelect}
        />
        <SearchSelect
          label="Quận / Huyện *"
          value={district}
          options={districts}
          placeholder={province ? 'Chọn quận / huyện' : 'Chọn tỉnh trước'}
          loading={loadingDistricts}
          disabled={!province || loadingDistricts}
          onSelect={handleDistrictSelect}
        />
        <SearchSelect
          label="Phường / Xã *"
          value={ward}
          options={wards}
          placeholder={district ? 'Chọn phường / xã' : 'Chọn huyện trước'}
          loading={loadingWards}
          disabled={!district || loadingWards}
          onSelect={(name) => onChange({ ward: name })}
        />
      </div>

      {/* Address line */}
      <div>
        <label className="text-xs text-slate-400 block mb-1 font-medium">Địa chỉ chi tiết (Số nhà, Tên đường...) *</label>
        <input
          type="text"
          required
          value={addressLine}
          onChange={(e) => onChange({ addressLine: e.target.value })}
          placeholder="VD: 12 Nguyễn Trãi, Phường Bến Thành"
          className="w-full text-base md:text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-slate-700 dark:text-white"
        />
      </div>

      {/* Map toggle */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
              🗺️ Xác nhận vị trí trên bản đồ
            </span>
            <span className="text-[9px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
              Tùy chọn
            </span>
          </div>
          <div className="flex items-center gap-3 justify-between sm:justify-end w-full sm:w-auto">
            {/* GPS button */}
            <button
              type="button"
              onClick={handleGetMyLocation}
              disabled={gettingLocation}
              className="text-[10px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1.5 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {gettingLocation ? (
                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : '📍'} Định vị vị trí
            </button>
            {/* Toggle map */}
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:border-rose-400 hover:text-rose-500 transition-all cursor-pointer"
            >
              {showMap ? 'Ẩn bản đồ' : 'Mở bản đồ'}
            </button>
          </div>
        </div>

        {showMap && (
          <div className="space-y-2 animate-fade-in">
            <MapPicker
              lat={mapLat}
              lng={mapLng}
              onLocationChange={handleMapLocationChange}
            />
            <p className="text-[10px] text-slate-400 text-center">
              Nhấp vào bản đồ hoặc kéo điểm ghim 📍 để xác định vị trí giao hàng chính xác
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
