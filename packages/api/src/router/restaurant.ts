import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { and, asc, between, eq, getTableColumns, sql } from "drizzle-orm";
import { z } from "zod/v4";

import { restaurant } from "@powell-oss/db/schema";

import { publicProcedure } from "../trpc";

/**
 * Haversine distance in miles between two lat/lng points, computed in SQL.
 *
 * Formula:  2 * R * asin(sqrt(
 *   sin((lat2 - lat1) / 2) ^ 2 +
 *   cos(lat1) * cos(lat2) * sin((lng2 - lng1) / 2) ^ 2
 * ))
 *
 * R = 3958.8 miles (earth radius).
 */
function haversineDistanceSql(lat: number, lng: number) {
  return sql<number>`
    2 * 3958.8 * asin(sqrt(
      power(sin(radians(${lat} - ${restaurant.latitude}::float8) / 2), 2) +
      cos(radians(${lat})) * cos(radians(${restaurant.latitude}::float8)) *
      power(sin(radians(${lng} - ${restaurant.longitude}::float8) / 2), 2)
    ))
  `;
}

/**
 * Approximate bounding box for a given radius in miles around a lat/lng.
 * Used as a cheap pre-filter so Postgres can use indexes before running
 * the expensive Haversine on every row.
 *
 * 1 degree of latitude ≈ 69 miles.
 * 1 degree of longitude ≈ 69 * cos(latitude) miles.
 */
function boundingBox(lat: number, lng: number, radiusMiles: number) {
  const latDelta = radiusMiles / 69;
  const lngDelta = radiusMiles / (69 * Math.cos((lat * Math.PI) / 180));
  return {
    latMin: (lat - latDelta).toFixed(7),
    latMax: (lat + latDelta).toFixed(7),
    lngMin: (lng - lngDelta).toFixed(7),
    lngMax: (lng + lngDelta).toFixed(7),
  };
}

const DEFAULT_RADIUS_MILES = 25;

export const restaurantRouter = {
  /**
   * List restaurants. When lat/lng are provided, returns results sorted by
   * distance with a computed `distanceMiles` field. Otherwise returns all
   * restaurants sorted alphabetically.
   */
  all: publicProcedure
    .input(
      z
        .object({
          lat: z.number().min(-90).max(90),
          lng: z.number().min(-180).max(180),
          radiusMiles: z.number().positive().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      // No location → return all, sorted by name.
      if (!input?.lat || !input?.lng) {
        const rows = await ctx.db
          .select({
            ...getTableColumns(restaurant),
            distanceMiles: sql<number | null>`null`,
          })
          .from(restaurant)
          .orderBy(asc(restaurant.name));
        return rows;
      }

      const { lat, lng } = input;
      const radius = input.radiusMiles ?? DEFAULT_RADIUS_MILES;
      const box = boundingBox(lat, lng, radius);
      const distance = haversineDistanceSql(lat, lng);

      const rows = await ctx.db
        .select({
          ...getTableColumns(restaurant),
          distanceMiles: distance,
        })
        .from(restaurant)
        .where(
          and(
            between(restaurant.latitude, box.latMin, box.latMax),
            between(restaurant.longitude, box.lngMin, box.lngMax),
          ),
        )
        .orderBy(asc(distance));

      // Filter by actual Haversine distance (bounding box is a rectangle, not
      // a circle — corners overshoot the radius slightly).
      return rows.filter((r) => (r.distanceMiles ?? Infinity) <= radius);
    }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const found = await ctx.db.query.restaurant.findFirst({
        where: eq(restaurant.slug, input.slug),
        with: {
          menuItems: true,
        },
      });

      if (!found) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Restaurant "${input.slug}" not found`,
        });
      }

      return found;
    }),
} satisfies TRPCRouterRecord;
