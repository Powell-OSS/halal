"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { RestaurantCard } from "~/components/restaurant-card";
import { useTRPC } from "~/trpc/react";

export function RestaurantList() {
  const trpc = useTRPC();
  const { data: restaurants } = useSuspenseQuery(
    trpc.restaurant.all.queryOptions(),
  );

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

  // Magazine-style: first restaurant is featured (spans 2 cols on sm+),
  // the rest fill the grid in a 3-column layout.
  const [featured, ...rest] = restaurants;

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {featured && (
        <RestaurantCard restaurant={featured} featured index={0} />
      )}
      {rest.map((r, i) => (
        <RestaurantCard key={r.id} restaurant={r} index={i + 1} />
      ))}
    </div>
  );
}
