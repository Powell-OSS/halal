"use client";

import { useQuery } from "@tanstack/react-query";

import { RestaurantCard } from "~/components/restaurant-card";
import { useLocation } from "~/providers/location-provider";
import { useTRPC } from "~/trpc/react";

/**
 * Home-page discovery list. Shows the 6 nearest restaurants in a
 * magazine-style grid (first one featured). Uses the paginated `all`
 * endpoint with limit=6.
 */
export function RestaurantList() {
  const trpc = useTRPC();
  const { location } = useLocation();

  const { data, isLoading } = useQuery(
    trpc.restaurant.all.queryOptions({
      lat: location.lat,
      lng: location.lng,
      limit: 6,
    }),
  );

  const restaurants = data?.items ?? [];

  if (isLoading) {
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

  if (restaurants.length === 0) {
    return (
      <div className="border-border text-muted-foreground rounded-2xl border border-dashed py-16 text-center text-sm">
        No restaurants yet. Run{" "}
        <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
          bun run db:seed
        </code>{" "}
        to add some.
      </div>
    );
  }

  const [featured, ...rest] = restaurants;

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {featured && <RestaurantCard restaurant={featured} featured index={0} />}
      {rest.map((r, i) => (
        <RestaurantCard key={r.id} restaurant={r} index={i + 1} />
      ))}
    </div>
  );
}
