/**
 * Static category list for the home page filter strip.
 *
 * Categories are config (a fixed set of cuisines we want to surface), not
 * user-generated content, so they live in code rather than the database.
 */

export interface Category {
  slug: string;
  label: string;
  emoji: string;
}

export const categories: Category[] = [
  { slug: "all", label: "All", emoji: "🍽️" },
  { slug: "pakistani", label: "Pakistani", emoji: "🇵🇰" },
  { slug: "turkish", label: "Turkish", emoji: "🥙" },
  { slug: "lebanese", label: "Lebanese", emoji: "🌯" },
  { slug: "indian", label: "Indian", emoji: "🍛" },
  { slug: "mediterranean", label: "Mediterranean", emoji: "🥗" },
  { slug: "persian", label: "Persian", emoji: "🍢" },
  { slug: "afghan", label: "Afghan", emoji: "🥘" },
  { slug: "malay", label: "Malay", emoji: "🍜" },
  { slug: "burgers", label: "Burgers", emoji: "🍔" },
  { slug: "desserts", label: "Desserts", emoji: "🍰" },
];
