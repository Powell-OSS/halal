/**
 * Seed the local database with sample halal restaurants.
 *
 * Run with: `bun run db:seed`
 */

import { db } from "./client";
import { menuItem, restaurant } from "./schema";

interface SeedMenuItem {
  section: string;
  name: string;
  description: string;
  priceCents: number;
  popular?: boolean;
}

interface SeedRestaurant {
  slug: string;
  name: string;
  imageUrl: string;
  tagline: string;
  cuisines: string[];
  rating: string;
  reviewCount: number;
  deliveryMinMinutes: number;
  deliveryMaxMinutes: number;
  distanceMiles: string;
  priceLevel: number;
  certification: string;
  address: string;
  hours: string;
  menu: SeedMenuItem[];
}

const data: SeedRestaurant[] = [
  {
    slug: "shahi-darbar",
    name: "Shahi Darbar",
    imageUrl: "https://picsum.photos/seed/shahi-darbar/800/500",
    tagline: "Royal Mughlai cuisine in the heart of Devon Avenue",
    cuisines: ["Pakistani", "Indian"],
    rating: "4.7",
    reviewCount: 1284,
    deliveryMinMinutes: 25,
    deliveryMaxMinutes: 35,
    distanceMiles: "1.2",
    priceLevel: 2,
    certification: "HFSAA",
    address: "412 Devon Ave, Chicago, IL",
    hours: "11:00 AM – 11:00 PM",
    menu: [
      {
        section: "Starters",
        name: "Chicken Pakora",
        description: "Crispy chickpea-battered chicken with mint chutney",
        priceCents: 899,
        popular: true,
      },
      {
        section: "Starters",
        name: "Seekh Kebab (2 pcs)",
        description: "Charcoal-grilled minced beef skewers",
        priceCents: 1099,
      },
      {
        section: "Starters",
        name: "Samosa Chaat",
        description:
          "Crushed samosas topped with chickpeas, yogurt, and tamarind",
        priceCents: 799,
      },
      {
        section: "Biryani & Rice",
        name: "Hyderabadi Chicken Biryani",
        description:
          "Slow-cooked basmati rice layered with marinated chicken and saffron",
        priceCents: 1599,
        popular: true,
      },
      {
        section: "Biryani & Rice",
        name: "Lamb Biryani",
        description: "Tender lamb shanks over fragrant basmati",
        priceCents: 1899,
      },
      {
        section: "Curries",
        name: "Butter Chicken",
        description: "Tandoori chicken in a creamy tomato-cashew gravy",
        priceCents: 1699,
        popular: true,
      },
      {
        section: "Curries",
        name: "Nihari",
        description: "Slow-braised beef shank stew, the Lahori classic",
        priceCents: 1799,
      },
    ],
  },
  {
    slug: "anatolia-grill",
    name: "Anatolia Grill",
    imageUrl: "https://picsum.photos/seed/anatolia-grill/800/500",
    tagline: "Wood-fired Turkish kebabs and fresh-baked pide",
    cuisines: ["Turkish", "Mediterranean"],
    rating: "4.6",
    reviewCount: 932,
    deliveryMinMinutes: 20,
    deliveryMaxMinutes: 30,
    distanceMiles: "0.8",
    priceLevel: 2,
    certification: "HMA",
    address: "1820 W Lawrence Ave, Chicago, IL",
    hours: "10:00 AM – 12:00 AM",
    menu: [
      {
        section: "Pide",
        name: "Lahmacun",
        description: "Thin Turkish flatbread with spiced minced lamb",
        priceCents: 899,
        popular: true,
      },
      {
        section: "Pide",
        name: "Sucuklu Pide",
        description: "Boat-shaped flatbread with Turkish sausage and cheese",
        priceCents: 1299,
      },
      {
        section: "Kebabs",
        name: "Adana Kebab Plate",
        description: "Hand-minced lamb kebab over rice with grilled veg",
        priceCents: 1799,
        popular: true,
      },
      {
        section: "Kebabs",
        name: "Chicken Shish",
        description: "Marinated chicken cubes with bulgur and salad",
        priceCents: 1599,
      },
    ],
  },
  {
    slug: "al-bait",
    name: "Al Bait",
    imageUrl: "https://picsum.photos/seed/al-bait/800/500",
    tagline: "Family-run Lebanese kitchen famous for fresh shawarma",
    cuisines: ["Lebanese", "Mediterranean"],
    rating: "4.8",
    reviewCount: 2103,
    deliveryMinMinutes: 15,
    deliveryMaxMinutes: 25,
    distanceMiles: "0.5",
    priceLevel: 2,
    certification: "IFANCA",
    address: "5601 N Clark St, Chicago, IL",
    hours: "11:00 AM – 10:00 PM",
    menu: [
      {
        section: "Mezze",
        name: "Hummus & Pita",
        description: "Creamy chickpea purée with warm pita",
        priceCents: 699,
      },
      {
        section: "Mezze",
        name: "Falafel (5 pcs)",
        description: "Crispy chickpea fritters with tahini",
        priceCents: 799,
        popular: true,
      },
      {
        section: "Shawarma",
        name: "Chicken Shawarma Wrap",
        description: "Marinated chicken, garlic sauce, pickles, fries",
        priceCents: 1199,
        popular: true,
      },
      {
        section: "Shawarma",
        name: "Beef Shawarma Plate",
        description: "Beef shawarma over rice with hummus and salad",
        priceCents: 1599,
      },
    ],
  },
  {
    slug: "kabul-kitchen",
    name: "Kabul Kitchen",
    imageUrl: "https://picsum.photos/seed/kabul-kitchen/800/500",
    tagline: "Authentic Afghan kabuli pulao and mantu",
    cuisines: ["Afghan"],
    rating: "4.5",
    reviewCount: 612,
    deliveryMinMinutes: 30,
    deliveryMaxMinutes: 45,
    distanceMiles: "2.1",
    priceLevel: 2,
    certification: "HFSAA",
    address: "3201 W Devon Ave, Chicago, IL",
    hours: "12:00 PM – 10:00 PM",
    menu: [
      {
        section: "Mains",
        name: "Kabuli Pulao",
        description: "Basmati rice with raisins, carrots, and tender lamb",
        priceCents: 1599,
        popular: true,
      },
      {
        section: "Mains",
        name: "Mantu",
        description: "Steamed lamb dumplings with yogurt and lentil sauce",
        priceCents: 1299,
      },
    ],
  },
  {
    slug: "saffron-house",
    name: "Saffron House",
    imageUrl: "https://picsum.photos/seed/saffron-house/800/500",
    tagline: "Saffron-scented Persian classics in a candlelit dining room",
    cuisines: ["Persian", "Mediterranean"],
    rating: "4.7",
    reviewCount: 845,
    deliveryMinMinutes: 25,
    deliveryMaxMinutes: 40,
    distanceMiles: "1.7",
    priceLevel: 3,
    certification: "Self-certified",
    address: "2828 N Sheffield Ave, Chicago, IL",
    hours: "5:00 PM – 11:00 PM",
    menu: [
      {
        section: "Kabobs",
        name: "Koobideh",
        description:
          "Two skewers of seasoned ground beef with saffron rice",
        priceCents: 1899,
        popular: true,
      },
      {
        section: "Kabobs",
        name: "Joojeh",
        description: "Saffron-marinated chicken breast over basmati",
        priceCents: 1799,
      },
      {
        section: "Stews",
        name: "Ghormeh Sabzi",
        description: "Herb stew with lamb, kidney beans, and dried lime",
        priceCents: 1699,
      },
    ],
  },
  {
    slug: "halal-burger-co",
    name: "Halal Burger Co",
    imageUrl: "https://picsum.photos/seed/halal-burger/800/500",
    tagline: "Smashed halal beef burgers with hand-cut fries",
    cuisines: ["Burgers", "American"],
    rating: "4.4",
    reviewCount: 1567,
    deliveryMinMinutes: 15,
    deliveryMaxMinutes: 25,
    distanceMiles: "0.9",
    priceLevel: 2,
    certification: "HFSAA",
    address: "2200 N Halsted St, Chicago, IL",
    hours: "11:00 AM – 2:00 AM",
    menu: [
      {
        section: "Burgers",
        name: "Classic Smash",
        description:
          "Two halal beef patties, American cheese, special sauce",
        priceCents: 999,
        popular: true,
      },
      {
        section: "Burgers",
        name: "Spicy Buffalo Chicken",
        description: "Crispy halal chicken, buffalo sauce, blue cheese",
        priceCents: 1099,
      },
      {
        section: "Sides",
        name: "Hand-cut Fries",
        description: "Fresh-cut, twice-fried, tossed with sea salt",
        priceCents: 499,
      },
    ],
  },
];

async function seed() {
  console.log("🌱 Seeding database…");

  // Idempotent: clear existing data first so re-running the seed produces a
  // clean state. Cascade FK on menu_item handles the menu cleanup.
  await db.delete(menuItem);
  await db.delete(restaurant);

  for (const r of data) {
    const { menu, ...rest } = r;
    const [inserted] = await db
      .insert(restaurant)
      .values(rest)
      .returning({ id: restaurant.id });

    if (!inserted) {
      throw new Error(`Failed to insert restaurant ${r.slug}`);
    }

    await db.insert(menuItem).values(
      menu.map((m, i) => ({
        restaurantId: inserted.id,
        section: m.section,
        name: m.name,
        description: m.description,
        priceCents: m.priceCents,
        popular: m.popular ?? false,
        sortOrder: i,
      })),
    );

    console.log(`  ✓ ${r.name} (${menu.length} menu items)`);
  }

  console.log(`\n✅ Seeded ${data.length} restaurants`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
