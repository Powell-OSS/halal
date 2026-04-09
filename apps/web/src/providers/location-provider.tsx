"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { reverseGeocode } from "~/lib/geocode";

export interface UserLocation {
  lat: number;
  lng: number;
  label: string;
  source: "gps" | "geocoded" | "stored" | "default";
}

const DEFAULT_LOCATION: UserLocation = {
  lat: 41.8781,
  lng: -87.6298,
  label: "Chicago, IL",
  source: "default",
};

const STORAGE_KEY = "halal-user-location";

function readStored(): UserLocation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      lat: number;
      lng: number;
      label: string;
    };
    if (
      typeof parsed.lat === "number" &&
      typeof parsed.lng === "number" &&
      typeof parsed.label === "string"
    ) {
      return { ...parsed, source: "stored" };
    }
  } catch {
    /* ignore */
  }
  return null;
}

function writeStored(loc: { lat: number; lng: number; label: string }) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ lat: loc.lat, lng: loc.lng, label: loc.label }),
    );
  } catch {
    /* quota / private mode */
  }
}

interface LocationContextValue {
  location: UserLocation;
  loading: boolean;
  setLocation: (loc: {
    lat: number;
    lng: number;
    label: string;
    source: UserLocation["source"];
  }) => void;
  requestGps: () => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

/**
 * Single source of truth for the user's location.
 *
 * Mount this once in the root layout. All children use `useLocation()` to
 * read/write location state. GPS is requested once on mount; subsequent
 * updates come from the header LocationInput or the "Use current location"
 * button.
 */
export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useState<UserLocation>(
    () => readStored() ?? DEFAULT_LOCATION,
  );
  const [loading, setLoading] = useState(false);

  const setLocation = useCallback(
    (loc: {
      lat: number;
      lng: number;
      label: string;
      source: UserLocation["source"];
    }) => {
      writeStored(loc);
      setLocationState(loc);
    },
    [],
  );

  const requestGps = useCallback(() => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        void reverseGeocode(latitude, longitude)
          .catch(() => null)
          .then((resolvedLabel) => {
            const label =
              resolvedLabel ??
              `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
            const next: UserLocation = {
              lat: latitude,
              lng: longitude,
              label,
              source: "gps",
            };
            writeStored(next);
            setLocationState(next);
            setLoading(false);
          });
      },
      () => setLoading(false),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300_000 },
    );
  }, []);

  // One GPS request on mount (deferred so setState isn't synchronous in effect).
  useEffect(() => {
    const timer = setTimeout(requestGps, 0);
    return () => clearTimeout(timer);
  }, [requestGps]);

  return (
    <LocationContext value={{ location, loading, setLocation, requestGps }}>
      {children}
    </LocationContext>
  );
}

/**
 * Access the shared location state. Must be used inside `<LocationProvider>`.
 */
export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error("useLocation must be used within <LocationProvider>");
  }
  return ctx;
}
