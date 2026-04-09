import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { asc, eq } from "@powell-oss/db";
import { restaurant } from "@powell-oss/db/schema";

import { publicProcedure } from "../trpc";

export const restaurantRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.restaurant.findMany({
      orderBy: asc(restaurant.name),
    });
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
