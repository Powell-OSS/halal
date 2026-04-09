import Link from "next/link";
import { ChevronDown, MapPin, Search, ShoppingBag } from "lucide-react";

import { Input } from "@powell-oss/ui/input";
import { ThemeToggle } from "@powell-oss/ui/theme";

export function Header() {
  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b border-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-baseline gap-1.5 text-foreground"
        >
          <span className="font-display text-2xl leading-none italic">
            halal.
          </span>
          <span className="text-primary text-sm font-medium tracking-tight">
            finder
          </span>
        </Link>

        <button
          type="button"
          className="border-border text-foreground hover:bg-muted hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition md:flex"
        >
          <MapPin className="text-primary h-4 w-4" />
          <span className="max-w-[180px] truncate">Chicago, IL</span>
          <ChevronDown className="text-muted-foreground h-4 w-4" />
        </button>

        <div className="relative max-w-xl flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Search halal restaurants or dishes…"
            className="bg-muted/60 border-border focus-visible:bg-card h-10 rounded-full pr-4 pl-10 text-sm shadow-none"
          />
        </div>

        <button
          type="button"
          aria-label="Cart"
          className="text-foreground hover:bg-muted relative hidden h-10 w-10 items-center justify-center rounded-full transition sm:flex"
        >
          <ShoppingBag className="h-5 w-5" />
        </button>

        <ThemeToggle />
      </div>
    </header>
  );
}
