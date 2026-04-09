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
  latitude: string;
  longitude: string;
  priceLevel: number;
  certification: string;
  address: string;
  hours: string;
  menu: SeedMenuItem[];
}

// Real geocoded coordinates for Chicago addresses.
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
    latitude: "41.9975",
    longitude: "-87.6718",
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
    latitude: "41.9685",
    longitude: "-87.6775",
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
    latitude: "41.9840",
    longitude: "-87.6685",
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
    latitude: "41.9975",
    longitude: "-87.7082",
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
    latitude: "41.9330",
    longitude: "-87.6538",
    priceLevel: 3,
    certification: "Self-certified",
    address: "2828 N Sheffield Ave, Chicago, IL",
    hours: "5:00 PM – 11:00 PM",
    menu: [
      {
        section: "Kabobs",
        name: "Koobideh",
        description: "Two skewers of seasoned ground beef with saffron rice",
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
    latitude: "41.9215",
    longitude: "-87.6489",
    priceLevel: 2,
    certification: "HFSAA",
    address: "2200 N Halsted St, Chicago, IL",
    hours: "11:00 AM – 2:00 AM",
    menu: [
      {
        section: "Burgers",
        name: "Classic Smash",
        description: "Two halal beef patties, American cheese, special sauce",
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
  // ── San Francisco ────────────────────────────────────────
  {
    slug: "zareen-sf",
    name: "Zareen's",
    imageUrl: "https://picsum.photos/seed/zareens/800/500",
    tagline: "Pakistani comfort food beloved by Silicon Valley",
    cuisines: ["Pakistani", "Indian"],
    rating: "4.8",
    reviewCount: 3420,
    deliveryMinMinutes: 20,
    deliveryMaxMinutes: 35,
    latitude: "37.4419",
    longitude: "-122.1430",
    priceLevel: 2,
    certification: "Self-certified",
    address: "365 S California Ave, Palo Alto, CA",
    hours: "11:00 AM – 9:30 PM",
    menu: [
      {
        section: "Grills",
        name: "Chicken Chapli Kebab",
        description: "Spiced ground chicken patty with herbs and onion",
        priceCents: 1599,
        popular: true,
      },
      {
        section: "Grills",
        name: "Lamb Seekh Kebab",
        description: "Charcoal-grilled minced lamb with cumin and coriander",
        priceCents: 1799,
      },
      {
        section: "Biryani",
        name: "Chicken Biryani",
        description: "Fragrant basmati layered with saffron chicken",
        priceCents: 1699,
        popular: true,
      },
      {
        section: "Wraps",
        name: "Chicken Boti Roll",
        description: "Tandoori chicken tikka in fresh naan with chutney",
        priceCents: 1399,
      },
    ],
  },
  {
    slug: "old-jerusalem-sf",
    name: "Old Jerusalem",
    imageUrl: "https://picsum.photos/seed/old-jerusalem/800/500",
    tagline: "Family-owned Palestinian kitchen on Mission Street since 1992",
    cuisines: ["Lebanese", "Mediterranean", "Palestinian"],
    rating: "4.5",
    reviewCount: 1876,
    deliveryMinMinutes: 15,
    deliveryMaxMinutes: 25,
    latitude: "37.7562",
    longitude: "-122.4195",
    priceLevel: 2,
    certification: "Self-certified",
    address: "2976 Mission St, San Francisco, CA",
    hours: "11:00 AM – 10:00 PM",
    menu: [
      {
        section: "Mezze",
        name: "Baba Ghanoush",
        description: "Smoky roasted eggplant with tahini and lemon",
        priceCents: 799,
      },
      {
        section: "Mezze",
        name: "Foul Mudammas",
        description: "Slow-cooked fava beans with olive oil, garlic, and lemon",
        priceCents: 899,
      },
      {
        section: "Plates",
        name: "Lamb Shawarma Plate",
        description:
          "Spit-roasted lamb over rice with pickles and garlic sauce",
        priceCents: 1699,
        popular: true,
      },
      {
        section: "Plates",
        name: "Mixed Grill",
        description: "Chicken shish, lamb kofta, and beef kebab with hummus",
        priceCents: 1999,
        popular: true,
      },
    ],
  },
  {
    slug: "shalimar-sf",
    name: "Shalimar",
    imageUrl: "https://picsum.photos/seed/shalimar-sf/800/500",
    tagline: "No-frills Pakistani grill on Polk Street — tandoori since 1975",
    cuisines: ["Pakistani", "Indian"],
    rating: "4.3",
    reviewCount: 2145,
    deliveryMinMinutes: 10,
    deliveryMaxMinutes: 20,
    latitude: "37.7867",
    longitude: "-122.4204",
    priceLevel: 1,
    certification: "HMA",
    address: "532 Jones St, San Francisco, CA",
    hours: "11:30 AM – 11:30 PM",
    menu: [
      {
        section: "Tandoori",
        name: "Tandoori Chicken (Half)",
        description:
          "Bone-in chicken marinated in yogurt and spices, clay-oven fired",
        priceCents: 1099,
        popular: true,
      },
      {
        section: "Tandoori",
        name: "Seekh Kebab (4 pcs)",
        description: "Ground lamb skewers with green chili and cilantro",
        priceCents: 1299,
      },
      {
        section: "Curries",
        name: "Goat Karahi",
        description:
          "Bone-in goat slow-cooked in tomato, ginger, and green chili",
        priceCents: 1599,
        popular: true,
      },
      {
        section: "Curries",
        name: "Chicken Tikka Masala",
        description: "Tandoori chicken chunks in creamy tomato sauce",
        priceCents: 1399,
      },
      {
        section: "Breads",
        name: "Garlic Naan",
        description: "Tandoor-baked flatbread with garlic and butter",
        priceCents: 399,
      },
    ],
  },
  {
    slug: "aria-korean-halal",
    name: "Aria Korean Halal",
    imageUrl: "https://picsum.photos/seed/aria-korean/800/500",
    tagline: "Halal Korean fried chicken and bibimbap in the Tenderloin",
    cuisines: ["Korean", "Asian"],
    rating: "4.6",
    reviewCount: 987,
    deliveryMinMinutes: 15,
    deliveryMaxMinutes: 30,
    latitude: "37.7837",
    longitude: "-122.4141",
    priceLevel: 2,
    certification: "HFSAA",
    address: "318 Eddy St, San Francisco, CA",
    hours: "11:00 AM – 9:00 PM",
    menu: [
      {
        section: "Fried Chicken",
        name: "Yangnyeom Chicken (8 pcs)",
        description: "Sweet-spicy gochujang-glazed halal fried chicken",
        priceCents: 1599,
        popular: true,
      },
      {
        section: "Fried Chicken",
        name: "Soy Garlic Chicken (8 pcs)",
        description: "Crispy chicken tossed in soy-garlic glaze",
        priceCents: 1599,
      },
      {
        section: "Rice Bowls",
        name: "Beef Bibimbap",
        description:
          "Seasoned halal beef, vegetables, egg, gochujang over rice",
        priceCents: 1499,
        popular: true,
      },
      {
        section: "Rice Bowls",
        name: "Chicken Bulgogi Bowl",
        description: "Marinated chicken with pickled daikon and sesame",
        priceCents: 1399,
      },
    ],
  },
];

async function seed() {
  console.log("🌱 Seeding database…");

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
