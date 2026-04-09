import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CategoryStrip } from "~/components/category-strip";
import { RestaurantList } from "~/components/restaurant-list";
import { categories } from "~/lib/categories";

export default function HomePage() {
  return (
    <main>
      {/* ── Editorial hero ──────────────────────────────────────── */}
      <section className="border-border border-b">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="text-muted-foreground mb-6 flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase">
            <span className="bg-primary inline-block h-px w-8" />
            Verified Halal
          </div>
          <h1 className="font-display text-foreground max-w-3xl text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Halal food,{" "}
            <span className="text-primary italic">served right.</span>
          </h1>
          <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-relaxed">
            Discover halal restaurants certified by trusted authorities — sorted
            by distance from you.
          </p>
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
              Near you
            </div>
            <h2 className="font-display text-foreground text-3xl tracking-tight sm:text-4xl">
              Restaurants
            </h2>
          </div>
          <Link
            href="/search"
            className="text-primary hover:text-primary/80 group flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
          >
            Search &amp; filter
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <RestaurantList />
      </section>
    </main>
  );
}
