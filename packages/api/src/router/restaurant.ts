import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { and, asc, eq, getTableColumns, sql } from "drizzle-orm";
import { z } from "zod/v4";

import { restaurant } from "@powell-oss/db/schema";

import { publicProcedure } from "../trpc";

const DEFAULT_PAGE_SIZE = 20;

/**
 * Haversine distance in miles between two lat/lng points, computed in SQL.
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
 * Build optional WHERE conditions for text search and cuisine category.
 */
function buildFilters(q?: string, cat?: string) {
  const conditions = [];

  if (q) {
    const pattern = `%${q}%`;
    conditions.push(
      sql`(
        ${restaurant.name} ILIKE ${pattern}
        OR ${restaurant.tagline} ILIKE ${pattern}
        OR EXISTS (
          SELECT 1 FROM unnest(${restaurant.cuisines}) AS c
          WHERE lower(c) LIKE ${`%${q.toLowerCase()}%`}
        )
      )`,
    );
  }

  if (cat) {
    conditions.push(
      sql`EXISTS (
        SELECT 1 FROM unnest(${restaurant.cuisines}) AS c
        WHERE lower(c) = ${cat.toLowerCase()}
      )`,
    );
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}

export const restaurantRouter = {
  /**
   * Paginated restaurant list with server-side search, category filter,
   * and distance sort.
   *
   * Returns `items` + `nextCursor` (offset-based). The client splits items
   * into "nearby" (≤100mi) and "other" (>100mi) for display.
   */
  all: publicProcedure
    .input(
      z
        .object({
          lat: z.number().min(-90).max(90).optional(),
          lng: z.number().min(-180).max(180).optional(),
          q: z.string().optional(),
          cat: z.string().optional(),
          cursor: z.number().int().nonnegative().default(0),
          limit: z
            .number()
            .int()
            .positive()
            .max(100)
            .default(DEFAULT_PAGE_SIZE),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const {
        lat,
        lng,
        q,
        cat,
        cursor = 0,
        limit = DEFAULT_PAGE_SIZE,
      } = input ?? {};

      const where = buildFilters(q, cat);
      const hasLocation = lat != null && lng != null;

      const distance = hasLocation
        ? haversineDistanceSql(lat, lng)
        : sql<number | null>`null`;

      const items = await ctx.db
        .select({
          ...getTableColumns(restaurant),
          distanceMiles: distance,
        })
        .from(restaurant)
        .where(where)
        .orderBy(hasLocation ? asc(distance) : asc(restaurant.name))
        .limit(limit + 1) // fetch one extra to determine if there's a next page
        .offset(cursor);

      const hasMore = items.length > limit;
      if (hasMore) items.pop(); // remove the extra probe item

      return {
        items,
        nextCursor: hasMore ? cursor + limit : null,
      };
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
