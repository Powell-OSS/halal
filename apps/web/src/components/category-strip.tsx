import Link from "next/link";

import type { Category } from "~/lib/categories";

/**
 * Discovery-mode category chips for the home page.
 *
 * These are entry points into the /search experience — clicking any chip
 * navigates to /search filtered by that cuisine. No active state because
 * the home page is purely browse, not filter.
 */
export function CategoryStrip({ categories }: { categories: Category[] }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max gap-2.5 py-1">
        {categories.map((category, i) => (
          <Link
            key={category.slug}
            href={
              category.slug === "all"
                ? "/search"
                : `/search?cat=${category.slug}`
            }
            style={{ animationDelay: `${i * 30}ms` }}
            className="border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary group animate-rise-in flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <span className="text-base leading-none">{category.emoji}</span>
            {category.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
