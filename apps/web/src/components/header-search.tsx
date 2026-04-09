"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@powell-oss/ui/input";

const DEBOUNCE_MS = 250;
const SEARCH_PATH = "/search";

export function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize from URL so deep-links work and the input stays in sync if the
  // user navigates back/forward.
  const urlQuery = searchParams.get("q") ?? "";
  const [value, setValue] = useState(urlQuery);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Keep input synced when URL changes from elsewhere.
  useEffect(() => {
    setValue(urlQuery);
  }, [urlQuery]);

  const pushUrl = (next: string) => {
    // When already on /search, preserve other params (like ?cat=) and use
    // replace so we don't pollute history with every keystroke.
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

    // Otherwise, route into the search experience.
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

  // Clicking the input (when not already on /search) should jump to the
  // search experience immediately for that focused-search feeling.
  const handleFocus = () => {
    if (pathname !== SEARCH_PATH) {
      router.push(SEARCH_PATH);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-xl flex-1">
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
      <Input
        type="search"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={handleFocus}
        placeholder="Search halal restaurants or dishes…"
        className="bg-muted/60 border-border focus-visible:bg-card h-10 rounded-full pr-4 pl-10 text-sm shadow-none"
      />
    </form>
  );
}
