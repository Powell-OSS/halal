import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MapPin, Star } from "lucide-react";

import { formatPrice, priceLevelLabel } from "~/lib/format";
import { getCaller } from "~/trpc/server";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RestaurantPage({ params }: PageProps) {
  const { slug } = await params;
  const caller = await getCaller();

  let restaurant;
  try {
    restaurant = await caller.restaurant.bySlug({ slug });
  } catch {
    notFound();
  }

  // Group menu items by section, preserving sortOrder.
  const sections = new Map<string, typeof restaurant.menuItems>();
  for (const item of restaurant.menuItems) {
    const list = sections.get(item.section) ?? [];
    list.push(item);
    sections.set(item.section, list);
  }

  return (
    <main>
      {/* ── Hero image with overlay ─────────────────────────────── */}
      <div className="bg-muted relative h-72 w-full overflow-hidden sm:h-96">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <Link
          href="/"
          className="bg-background/90 text-foreground hover:bg-background absolute top-6 left-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium shadow-sm backdrop-blur transition sm:left-6 lg:left-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Title block (overlapping the hero) ─────────────────── */}
        <header className="-mt-16 mb-12 sm:-mt-24">
          <div className="bg-card border-border max-w-3xl rounded-2xl border p-8 shadow-lg sm:p-10">
            <div className="text-primary mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase">
              {restaurant.certification} Certified Halal
            </div>
            <h1 className="font-display text-foreground text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {restaurant.name}
            </h1>
            <p className="font-display text-muted-foreground mt-2 text-xl italic sm:text-2xl">
              {restaurant.tagline}
            </p>

            <div className="text-foreground mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5">
                <Star className="fill-accent text-accent h-4 w-4" />
                <strong>{Number(restaurant.rating).toFixed(1)}</strong>
                <span className="text-muted-foreground">
                  ({restaurant.reviewCount.toLocaleString()})
                </span>
              </span>
              <span className="text-border">·</span>
              <span>{restaurant.cuisines.join(", ")}</span>
              <span className="text-border">·</span>
              <span>{priceLevelLabel(restaurant.priceLevel)}</span>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="text-muted-foreground h-4 w-4" />
                {restaurant.deliveryMinMinutes}–{restaurant.deliveryMaxMinutes}{" "}
                min
              </span>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="text-muted-foreground h-4 w-4" />
                {Number(restaurant.distanceMiles).toFixed(1)} mi
              </span>
            </div>

            <div className="text-muted-foreground border-border mt-6 border-t pt-4 text-sm">
              {restaurant.address} <span className="text-border">·</span>{" "}
              {restaurant.hours}
            </div>
          </div>
        </header>

        {/* ── Menu sections ──────────────────────────────────────── */}
        <div className="mb-20 space-y-14">
          {Array.from(sections.entries()).map(([section, items]) => (
            <section key={section}>
              <div className="mb-6 flex items-baseline gap-4">
                <h2 className="font-display text-foreground text-3xl italic tracking-tight">
                  {section}
                </h2>
                <span className="bg-border h-px flex-1" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="border-border bg-card hover:border-primary/30 group flex items-start justify-between gap-6 rounded-2xl border p-5 transition-all hover:shadow-md"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-foreground group-hover:text-primary font-semibold transition-colors">
                          {item.name}
                        </h3>
                        {item.popular && (
                          <span className="bg-accent/20 text-accent-foreground rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-foreground shrink-0 text-right text-base font-semibold">
                      {formatPrice(item.priceCents)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
