import { SearchView } from "~/components/search-view";

export const metadata = {
  title: "Search · Halal Food Finder",
};

/**
 * Search page — fully client-driven.
 *
 * No server-side prefetch because the query depends on the user's location
 * (resolved client-side via browser GPS / localStorage). SearchView handles
 * its own loading states via useQuery.
 */
export default function SearchPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SearchView />
    </main>
  );
}
