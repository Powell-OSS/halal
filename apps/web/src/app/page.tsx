import { Suspense } from "react";
import { Filter, MapPin } from "lucide-react";

import { CategoryStrip } from "~/components/category-strip";
import { RestaurantList } from "~/components/restaurant-list";
import { categories } from "~/lib/categories";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

export default function HomePage() {
  prefetch(trpc.restaurant.all.queryOptions());

  return (
    <HydrateClient>
      <main>
        {/* ── Editorial hero ──────────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <div className="grid items-end gap-10 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <div className="text-muted-foreground mb-6 flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase">
                  <span className="bg-primary inline-block h-px w-8" />
                  Verified Halal · Chicago
                </div>
                <h1 className="font-display text-foreground text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                  Halal food,{" "}
                  <span className="text-primary italic">served right.</span>
                </h1>
                <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-relaxed">
                  A handpicked guide to restaurants certified by trusted halal
                  authorities. From Devon Avenue to West Loop.
                </p>
              </div>

              <div className="lg:col-span-4 lg:pl-8">
                <div className="border-border bg-card flex flex-col gap-3 rounded-2xl border p-5">
                  <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
                    <MapPin className="text-primary h-3.5 w-3.5" />
                    Delivering to
                  </div>
                  <div className="text-foreground text-lg font-semibold">
                    Chicago, IL
                  </div>
                  <button
                    type="button"
                    className="text-primary hover:text-primary/80 self-start text-sm font-medium underline-offset-4 hover:underline"
                  >
                    Change location →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Categories ──────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
          <CategoryStrip categories={categories} />
        </section>

        {/* ── Restaurants ─────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="text-muted-foreground mb-2 text-xs font-medium tracking-[0.2em] uppercase">
                The list
              </div>
              <h2 className="font-display text-foreground text-3xl tracking-tight sm:text-4xl">
                Restaurants near you
              </h2>
            </div>
            <button
              type="button"
              className="border-border bg-card text-foreground hover:border-primary/40 hover:text-primary flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>

          <Suspense fallback={<RestaurantGridSkeleton />}>
            <RestaurantList />
          </Suspense>
        </section>
      </main>
    </HydrateClient>
  );
}

function RestaurantGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div
            className={
              i === 0
                ? "bg-muted aspect-[16/10] animate-pulse rounded-2xl sm:col-span-2 sm:row-span-2"
                : "bg-muted aspect-[4/3] animate-pulse rounded-2xl"
            }
          />
          <div className="bg-muted h-5 w-2/3 animate-pulse rounded" />
          <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}
