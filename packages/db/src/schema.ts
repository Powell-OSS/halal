import { relations, sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";

export const restaurant = pgTable("restaurant", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  slug: t.varchar({ length: 128 }).notNull().unique(),
  name: t.varchar({ length: 256 }).notNull(),
  imageUrl: t.text().notNull(),
  tagline: t.text().notNull(),
  cuisines: t.text().array().notNull(),
  rating: t.numeric({ precision: 2, scale: 1 }).notNull(),
  reviewCount: t.integer().notNull().default(0),
  deliveryMinMinutes: t.integer().notNull(),
  deliveryMaxMinutes: t.integer().notNull(),
  distanceMiles: t.numeric({ precision: 4, scale: 1 }).notNull(),
  priceLevel: t.integer().notNull(),
  certification: t.varchar({ length: 32 }).notNull(),
  address: t.text().notNull(),
  hours: t.varchar({ length: 128 }).notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const menuItem = pgTable("menu_item", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  restaurantId: t
    .uuid()
    .notNull()
    .references(() => restaurant.id, { onDelete: "cascade" }),
  section: t.varchar({ length: 128 }).notNull(),
  name: t.varchar({ length: 256 }).notNull(),
  description: t.text().notNull(),
  priceCents: t.integer().notNull(),
  popular: t.boolean().notNull().default(false),
  sortOrder: t.integer().notNull().default(0),
  createdAt: t.timestamp().defaultNow().notNull(),
}));

export const restaurantRelations = relations(restaurant, ({ many }) => ({
  menuItems: many(menuItem),
}));

export const menuItemRelations = relations(menuItem, ({ one }) => ({
  restaurant: one(restaurant, {
    fields: [menuItem.restaurantId],
    references: [restaurant.id],
  }),
}));

export * from "./auth-schema";
