"use client";

import { useRef, useState } from "react";
import { Loader2, MapPin, Navigation } from "lucide-react";

import { Button } from "@powell-oss/ui/button";
import { Input } from "@powell-oss/ui/input";

import { geocodeAddress } from "~/lib/geocode";
import { useLocation } from "~/providers/location-provider";

/**
 * Full-screen onboarding overlay shown on first visit when no stored location
 * exists and GPS hasn't resolved.
 *
 * Visible when: location.source === "default" AND loading === false.
 * Dismisses when: user sets a location (GPS or typed) OR clicks "Skip".
 */
export function LocationOnboarding() {
  const { location, loading, setLocation, requestGps } = useLocation();
  const [value, setValue] = useState("");
  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Don't show if:
  // - User already has a non-default location (GPS, stored, or geocoded)
  // - GPS is still loading (give it a chance)
  // - User dismissed manually
  const show = !dismissed && !loading && location.source === "default";

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;

    setGeocoding(true);
    setError(null);
    const result = await geocodeAddress(q);
    setGeocoding(false);

    if (!result) {
      setError("Couldn't find that location. Try a city name or zip code.");
      return;
    }

    setLocation({
      lat: result.lat,
      lng: result.lng,
      label: result.label,
      source: "geocoded",
    });
  };

  const handleGps = () => {
    requestGps();
    // Onboarding will dismiss once location.source changes from "default"
    // If GPS fails, it stays — user can still type or skip.
  };

  return (
    <div className="bg-background/80 fixed inset-0 z-[100] flex items-center justify-center px-4 backdrop-blur-sm">
      <div className="bg-card border-border w-full max-w-md rounded-3xl border p-8 shadow-2xl sm:p-10">
        <div className="mb-8 text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl">
            <MapPin className="text-primary h-7 w-7" />
          </div>
          <h2 className="font-display text-foreground text-3xl tracking-tight italic">
            Where are you?
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Enter your city or zip code so we can show halal restaurants near
            you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <MapPin className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
            <Input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(null);
              }}
              placeholder="City, zip, or address…"
              disabled={geocoding}
              className="h-12 rounded-2xl pl-11 text-base"
              autoFocus
            />
          </div>
          {error && <p className="text-destructive px-1 text-xs">{error}</p>}
          <Button
            type="submit"
            disabled={geocoding || !value.trim()}
            className="h-12 w-full rounded-2xl text-base"
          >
            {geocoding ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Finding…
              </>
            ) : (
              "Set location"
            )}
          </Button>
        </form>

        <div className="mt-4 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleGps}
            className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm font-medium"
          >
            <Navigation className="h-4 w-4" />
            Use my current location
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
          >
            Skip — show me Chicago
          </button>
        </div>
      </div>
    </div>
  );
}
