import { Suspense } from "react";

import { SearchView } from "~/components/search-view";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

export const metadata = {
  title: "Search · Halal Food Finder",
};

export default function SearchPage() {
  prefetch(trpc.restaurant.all.queryOptions());

  return (
    <HydrateClient>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Suspense fallback={<SearchSkeleton />}>
          <SearchView />
        </Suspense>
      </main>
    </HydrateClient>
  );
}

function SearchSkeleton() {
  return (
    <div className="space-y-8">
      <div className="bg-muted h-12 w-full animate-pulse rounded-2xl" />
      <div className="flex gap-2.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-muted h-10 w-24 animate-pulse rounded-full"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="bg-muted aspect-[4/3] animate-pulse rounded-2xl" />
            <div className="bg-muted h-5 w-2/3 animate-pulse rounded" />
            <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
