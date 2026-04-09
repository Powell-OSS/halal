import Link from "next/link";
import { ChevronDown, MapPin, ShoppingBag } from "lucide-react";

import { ThemeToggle } from "@powell-oss/ui/theme";

import { HeaderSearch } from "./header-search";

export function Header() {
  return (
    <header className="bg-background border-border sticky top-0 z-50 w-full border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group text-foreground flex shrink-0 items-baseline gap-1.5"
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

        <HeaderSearch />

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
