"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, MapPin, Navigation, Search } from "lucide-react";

import { cn } from "@powell-oss/ui";
import { Input } from "@powell-oss/ui/input";

import { geocodeAddress } from "~/lib/geocode";
import { useLocation } from "~/providers/location-provider";

const DEBOUNCE_MS = 250;
const SEARCH_PATH = "/search";

/**
 * Yelp-style dual-input search bar.
 *
 *   [ 🔍 halal chicken       ] near [ 📍 San Francisco, CA ]
 *
 * The "what" input drives the ?q= search param and navigates to /search.
 * The "where" input geocodes a city/address via Nominatim and updates the
 * shared location context. Both are always visible and editable.
 */
export function SearchBar() {
  return (
    <div className="flex max-w-2xl flex-1 items-center">
      <div className="border-border bg-muted/40 flex w-full items-center rounded-full border">
        <WhatInput />
        <div className="bg-border h-6 w-px shrink-0" />
        <WhereInput />
      </div>
    </div>
  );
}

/** Left side — "Find" input */
function WhatInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") ?? "";
  const [value, setValue] = useState(urlQuery);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setValue(urlQuery);
  }, [urlQuery]);

  const pushUrl = (next: string) => {
    if (pathname === SEARCH_PATH) {
      const params = new URLSearchParams(searchParams.toString());
      if (next.trim()) {
        params.set("q", next.trim());
      } else {
        params.delete("q");
      }
      const qs = params.toString();
      router.replace(qs ? `${SEARCH_PATH}?${qs}` : SEARCH_PATH, {
        scroll: false,
      });
      return;
    }
    if (next.trim()) {
      router.push(`${SEARCH_PATH}?q=${encodeURIComponent(next.trim())}`);
    } else {
      router.push(SEARCH_PATH);
    }
  };

  const handleChange = (next: string) => {
    setValue(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushUrl(next), DEBOUNCE_MS);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    pushUrl(value);
  };

  const handleFocus = () => {
    if (pathname !== SEARCH_PATH) {
      router.push(SEARCH_PATH);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative min-w-0 flex-1">
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
      <Input
        type="search"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={handleFocus}
        placeholder="Search halal food…"
        className="h-10 rounded-full rounded-r-none border-0 bg-transparent pr-2 pl-10 text-sm shadow-none focus-visible:ring-0"
      />
    </form>
  );
}

/** Right side — "Near" location input */
function WhereInput() {
  const {
    location,
    loading: gpsLoading,
    setLocation,
    requestGps,
  } = useLocation();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [geocoding, setGeocoding] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const busy = gpsLoading || geocoding;

  const openEditor = () => {
    setValue("");
    setEditing(true);
    setShowDropdown(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const closeEditor = () => {
    setEditing(false);
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) {
      closeEditor();
      return;
    }
    setGeocoding(true);
    const result = await geocodeAddress(q);
    setGeocoding(false);
    if (result) {
      setLocation({
        lat: result.lat,
        lng: result.lng,
        label: result.label,
        source: "geocoded",
      });
    }
    closeEditor();
  };

  const handleGps = () => {
    requestGps();
    closeEditor();
  };

  if (!editing) {
    return (
      <button
        type="button"
        onClick={openEditor}
        className="hover:bg-muted/60 flex h-10 min-w-0 shrink-0 items-center gap-2 rounded-full rounded-l-none px-4 text-sm transition"
      >
        <MapPin
          className={cn(
            "text-primary h-4 w-4 shrink-0",
            busy && "animate-pulse",
          )}
        />
        <span className="text-foreground max-w-[140px] truncate text-left font-medium sm:max-w-[180px]">
          {busy ? "Locating…" : location.label}
        </span>
      </button>
    );
  }

  return (
    <div className="relative flex min-w-0 shrink-0 items-center">
      <form onSubmit={handleSubmit} className="flex items-center">
        <MapPin className="text-primary ml-3 h-4 w-4 shrink-0" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setTimeout(() => closeEditor(), 200)}
          placeholder={location.label}
          disabled={geocoding}
          className="h-10 w-36 rounded-full rounded-l-none border-0 bg-transparent px-2 text-sm shadow-none focus-visible:ring-0 sm:w-44"
        />
        {geocoding && (
          <Loader2 className="text-muted-foreground mr-3 h-4 w-4 animate-spin" />
        )}
      </form>

      {showDropdown && (
        <div className="bg-card border-border absolute top-full right-0 z-50 mt-2 w-52 rounded-xl border p-1.5 shadow-lg">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleGps();
            }}
            className="text-foreground hover:bg-muted flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition"
          >
            <Navigation className="text-primary h-4 w-4" />
            Use current location
          </button>
        </div>
      )}
    </div>
  );
}
