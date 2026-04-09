/**
 * Forward + reverse geocoding via Nominatim (OpenStreetMap).
 *
 * Free, no API key. Rate-limited to 1 req/sec (we only call on explicit user
 * actions so this is fine).
 */

const BASE = "https://nominatim.openstreetmap.org";
const HEADERS = {
  "User-Agent": "HalalFoodFinder/1.0",
  Accept: "application/json",
};

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

export interface GeocodedLocation {
  lat: number;
  lng: number;
  label: string;
}

/**
 * Forward geocode: address/city string → lat/lng + label.
 * Returns null if nothing was found.
 */
export async function geocodeAddress(
  query: string,
): Promise<GeocodedLocation | null> {
  const url = `${BASE}/search?${new URLSearchParams({
    q: query,
    format: "json",
    limit: "1",
    addressdetails: "1",
  })}`;

  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) return null;

  const data = (await res.json()) as NominatimResult[];
  const first = data[0];
  if (!first) return null;

  return {
    lat: parseFloat(first.lat),
    lng: parseFloat(first.lon),
    label: simplifyLabel(first.display_name),
  };
}

/**
 * Reverse geocode: lat/lng → human-readable label.
 * Returns null on failure.
 */
export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<string | null> {
  const url = `${BASE}/reverse?${new URLSearchParams({
    lat: lat.toString(),
    lon: lng.toString(),
    format: "json",
    zoom: "10",
  })}`;

  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) return null;

  const data = (await res.json()) as { display_name?: string };
  if (!data.display_name) return null;

  return simplifyLabel(data.display_name);
}

/**
 * Nominatim returns very long display_names like
 *   "Chicago, Cook County, Illinois, United States"
 * Simplify to "Chicago, Illinois" (city + state) or first two meaningful parts.
 */
function simplifyLabel(displayName: string): string {
  const parts = displayName.split(",").map((s) => s.trim());
  // Take first two non-empty, non-country parts.
  const meaningful = parts.filter(
    (p) => p && !["United States", "USA", "US"].includes(p),
  );
  return meaningful.slice(0, 2).join(", ");
}
