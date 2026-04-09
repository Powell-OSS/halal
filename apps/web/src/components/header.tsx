import Link from "next/link";

import { ThemeToggle } from "@powell-oss/ui/theme";

import { SearchBar } from "./search-bar";

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

        <SearchBar />

        <ThemeToggle />
      </div>
    </header>
  );
}
