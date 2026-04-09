"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ChevronDown, Loader2, Locate } from "lucide-react";

import { cn } from "@powell-oss/ui";
import { Button } from "@powell-oss/ui/button";

import { RestaurantCard } from "~/components/restaurant-card";
import { categories } from "~/lib/categories";
import { useLocation } from "~/providers/location-provider";
import { useTRPC } from "~/trpc/react";

/**
 * Search page body. Reads ?q and ?cat from the URL (set by the header
 * SearchBar), fetches paginated restaurants from the server (server handles
 * text + category filtering + distance sort), renders a flat grid with
 * "Load more" pagination.
 */
export function SearchView() {
  const trpc = useTRPC();
  const { location, loading: locLoading } = useLocation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? undefined;
  const cat = searchParams.get("cat") ?? undefined;
  const hasFilter = (q && q.trim().length > 0) || (cat && cat !== "all");

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      ...trpc.restaurant.all.infiniteQueryOptions(
        {
          lat: location.lat,
          lng: location.lng,
          q: q?.trim() || undefined,
          cat: cat && cat !== "all" ? cat : undefined,
        },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        },
      ),
    });

  const allItems = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data],
  );

  const updateCat = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug && slug !== "all") {
      params.set("cat", slug);
    } else {
      params.delete("cat");
    }
    const qs = params.toString();
    router.replace(qs ? `/search?${qs}` : "/search", { scroll: false });
  };

  const clearAll = () => {
    router.replace("/search", { scroll: false });
  };

  const activeCat = cat && cat !== "all" ? cat.toLowerCase() : "all";

  return (
    <div className="space-y-8">
      {/* ── Active filters summary ────────────────────────────── */}
      {hasFilter && (
        <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
          {q && q.trim() && (
            <span className="border-border bg-card text-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
              🔍 {q}
            </span>
          )}
          {cat && cat !== "all" && (
            <span className="border-border bg-card text-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
              {categories.find((c) => c.slug === cat)?.emoji} {cat}
            </span>
          )}
          <button
            type="button"
            onClick={clearAll}
            className="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ── Location indicator ─────────────────────────────────── */}
      <div className="text-muted-foreground flex items-center gap-2 text-xs">
        <Locate className={cn("h-3.5 w-3.5", locLoading && "animate-pulse")} />
        {locLoading
          ? "Finding your location…"
          : `Sorted by distance from ${location.label}`}
      </div>

      {/* ── Cuisine filter chips ───────────────────────────────── */}
      <div className="-mx-4 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-2.5 py-1">
          {categories.map((category) => {
            const isActive = category.slug === activeCat;
            return (
              <button
                key={category.slug}
                type="button"
                onClick={() => updateCat(category.slug)}
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
            {hasFilter ? "Results" : "Nearest to you"}
          </div>
          <h2 className="font-display text-foreground mt-1 text-2xl tracking-tight italic sm:text-3xl">
            {isLoading
              ? "Loading…"
              : `${allItems.length} ${allItems.length === 1 ? "restaurant" : "restaurants"}`}
          </h2>
        </div>
      </div>

      {/* ── Results grid ───────────────────────────────────────── */}
      {isLoading ? (
        <SearchSkeleton />
      ) : allItems.length === 0 ? (
        <NoResults q={q} cat={cat} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {allItems.map((r, i) => (
              <RestaurantCard key={r.id} restaurant={r} index={i} />
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="rounded-full px-8"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading…
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Load more
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="bg-muted aspect-[4/3] animate-pulse rounded-2xl" />
          <div className="bg-muted h-5 w-2/3 animate-pulse rounded" />
          <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}

function NoResults({ q, cat }: { q?: string; cat?: string }) {
  return (
    <div className="border-border bg-card flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-20 text-center">
      <div className="font-display text-foreground text-3xl italic">
        No matches
      </div>
      <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
        {q && cat && cat !== "all" ? (
          <>
            Nothing found for{" "}
            <span className="text-foreground font-semibold">
              &ldquo;{q}&rdquo;
            </span>{" "}
            in <span className="text-foreground font-semibold">{cat}</span>.
          </>
        ) : q ? (
          <>
            Nothing found for{" "}
            <span className="text-foreground font-semibold">
              &ldquo;{q}&rdquo;
            </span>
            . Try another dish, cuisine, or restaurant.
          </>
        ) : cat ? (
          <>
            No restaurants in{" "}
            <span className="text-foreground font-semibold">{cat}</span> yet.
          </>
        ) : (
          <>No restaurants found nearby.</>
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
