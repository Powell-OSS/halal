"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";

import { cn } from "@powell-oss/ui";
import { Input } from "@powell-oss/ui/input";

import { RestaurantCard } from "~/components/restaurant-card";
import { categories } from "~/lib/categories";
import { useTRPC } from "~/trpc/react";

const DEBOUNCE_MS = 200;

export function SearchView() {
  const trpc = useTRPC();
  const { data: restaurants } = useSuspenseQuery(
    trpc.restaurant.all.queryOptions(),
  );

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const urlQuery = searchParams.get("q") ?? "";
  const urlCat = searchParams.get("cat") ?? "";

  const [value, setValue] = useState(urlQuery);

  // Auto-focus the search input on mount.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Sync local input state when URL changes (e.g. category click, browser nav).
  useEffect(() => {
    setValue(urlQuery);
  }, [urlQuery]);

  const updateParam = (key: "q" | "cat", next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next.trim() && next !== "all") {
      params.set(key, next.trim());
    } else {
      params.delete(key);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const handleChange = (next: string) => {
    setValue(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParam("q", next), DEBOUNCE_MS);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    updateParam("q", value);
  };

  const clearAll = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setValue("");
    router.replace(pathname, { scroll: false });
  };

  // Filter restaurants by URL state.
  const q = urlQuery.trim().toLowerCase();
  const cat = urlCat.toLowerCase();
  const hasFilter = q.length > 0 || (cat.length > 0 && cat !== "all");
  const activeCat = cat && cat !== "all" ? cat : "all";

  const filtered = useMemo(() => {
    return restaurants.filter((r) => {
      const matchesSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.tagline.toLowerCase().includes(q) ||
        r.cuisines.some((c) => c.toLowerCase().includes(q));

      const matchesCat =
        !cat ||
        cat === "all" ||
        r.cuisines.some((c) => c.toLowerCase() === cat);

      return matchesSearch && matchesCat;
    });
  }, [restaurants, q, cat]);

  return (
    <div className="space-y-8">
      {/* ── Big search input ────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2" />
        <Input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search for restaurants, dishes, or cuisines…"
          className="bg-card border-border h-14 rounded-2xl pr-14 pl-14 text-base shadow-sm md:text-lg"
        />
        {value && (
          <button
            type="button"
            onClick={clearAll}
            aria-label="Clear search"
            className="text-muted-foreground hover:bg-muted hover:text-foreground absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full transition"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* ── Cuisine filter chips ───────────────────────────────── */}
      <div className="-mx-4 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-2.5 py-1">
          {categories.map((category) => {
            const isActive = category.slug === activeCat;
            return (
              <button
                key={category.slug}
                type="button"
                onClick={() => updateParam("cat", category.slug)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
                )}
              >
                <span className="text-base leading-none">{category.emoji}</span>
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Results header ─────────────────────────────────────── */}
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-muted-foreground text-xs font-medium tracking-[0.2em] uppercase">
            {hasFilter ? "Results" : "All restaurants"}
          </div>
          <h2 className="font-display text-foreground mt-1 text-2xl tracking-tight italic sm:text-3xl">
            {filtered.length}{" "}
            {filtered.length === 1 ? "restaurant" : "restaurants"}
          </h2>
        </div>
        {hasFilter && (
          <button
            type="button"
            onClick={clearAll}
            className="text-muted-foreground hover:text-foreground text-sm font-medium underline-offset-4 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Results grid / empty states ─────────────────────────── */}
      {filtered.length === 0 ? (
        <NoResults q={q} cat={cat} />
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r, i) => (
            <RestaurantCard key={r.id} restaurant={r} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function NoResults({ q, cat }: { q: string; cat: string }) {
  return (
    <div className="border-border bg-card flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-20 text-center">
      <div className="font-display text-foreground text-3xl italic">
        No matches
      </div>
      <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
        {q && cat && cat !== "all" ? (
          <>
            Nothing found for{" "}
            <span className="text-foreground font-semibold">"{q}"</span> in{" "}
            <span className="text-foreground font-semibold">{cat}</span>.
          </>
        ) : q ? (
          <>
            Nothing found for{" "}
            <span className="text-foreground font-semibold">"{q}"</span>. Try
            another dish, cuisine, or restaurant.
          </>
        ) : (
          <>
            No restaurants in{" "}
            <span className="text-foreground font-semibold">{cat}</span> yet.
          </>
        )}
      </p>
      <Link
        href="/search"
        className="text-primary mt-2 text-sm font-medium underline-offset-4 hover:underline"
      >
        Clear filters
      </Link>
    </div>
  );
}
