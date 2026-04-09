import type { Category } from "~/lib/categories";

export function CategoryStrip({ categories }: { categories: Category[] }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max gap-2.5 py-1">
        {categories.map((category, i) => (
          <button
            key={category.slug}
            type="button"
            style={{ animationDelay: `${i * 30}ms` }}
            className="border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary group flex animate-rise-in items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <span className="text-base leading-none">{category.emoji}</span>
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
