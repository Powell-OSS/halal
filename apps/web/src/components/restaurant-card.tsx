import Link from "next/link";
import { Clock, Star } from "lucide-react";

import type { RouterOutputs } from "@powell-oss/api";
import { cn } from "@powell-oss/ui";

import { priceLevelLabel } from "~/lib/format";

type Restaurant = RouterOutputs["restaurant"]["all"][number];

interface Props {
  restaurant: Restaurant;
  /** When true, renders a magazine-style hero card spanning more space. */
  featured?: boolean;
  /** Index used to stagger the rise-in animation. */
  index?: number;
}

export function RestaurantCard({
  restaurant,
  featured = false,
  index = 0,
}: Props) {
  return (
    <Link
      href={`/restaurants/${restaurant.slug}`}
      style={{ animationDelay: `${index * 60}ms` }}
      className={cn(
        "group animate-rise-in flex flex-col gap-3",
        featured && "sm:col-span-2 sm:row-span-2",
      )}
    >
      <div
        className={cn(
          "bg-muted relative w-full overflow-hidden rounded-2xl",
          featured ? "aspect-[16/10]" : "aspect-[4/3]",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />

        {/* warm vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* certification chip */}
        <div className="bg-background/95 text-primary absolute top-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase shadow-sm backdrop-blur">
          {restaurant.certification}
        </div>

        {/* rating chip */}
        <div className="bg-background/95 text-foreground absolute right-3 bottom-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur">
          <Star className="fill-accent text-accent h-3 w-3" />
          {Number(restaurant.rating).toFixed(1)}
          <span className="text-muted-foreground font-normal">
            ({restaurant.reviewCount.toLocaleString()})
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <h3
          className={cn(
            "text-foreground group-hover:text-primary font-semibold transition-colors",
            featured ? "font-display text-2xl italic" : "text-base",
          )}
        >
          {restaurant.name}
        </h3>

        {featured && (
          <p className="text-muted-foreground text-sm leading-relaxed">
            {restaurant.tagline}
          </p>
        )}

        <p className="text-muted-foreground text-sm">
          {restaurant.cuisines.join(" · ")}{" "}
          <span className="text-border">·</span>{" "}
          {priceLevelLabel(restaurant.priceLevel)}
        </p>

        <div className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-xs">
          <Clock className="h-3.5 w-3.5" />
          <span>
            {restaurant.deliveryMinMinutes}–{restaurant.deliveryMaxMinutes} min
          </span>
          <span className="text-border">·</span>
          <span>{Number(restaurant.distanceMiles).toFixed(1)} mi</span>
        </div>
      </div>
    </Link>
  );
}
