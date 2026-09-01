import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LibraryMap } from "@/components/LibraryMap";
import { BOOKS, CATEGORIES } from "@/lib/books";
import { useLibrary } from "@/lib/library-store";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories & Library Map — Smart Library Book Finder" },
      {
        name: "description",
        content:
          "Browse the library by category and see the block, rack and shelf layout of the whole college library.",
      },
      { property: "og:title", content: "Categories & Library Map — Smart Library" },
      { property: "og:description", content: "Eight categories across three library blocks." },
    ],
  }),
  component: () => (
    <AppShell>
      <Categories />
    </AppShell>
  ),
});

function Categories() {
  const { isAvailable } = useLibrary();
  const sample = BOOKS[0];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold">Categories 📂</h1>
        <p className="mt-2 text-muted-foreground">
          {BOOKS.length} books across {CATEGORIES.length} categories and 3 blocks.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((c) => {
          const books = BOOKS.filter((b) => b.category === c);
          const avail = books.filter((b) => isAvailable(b)).length;
          return (
            <Link
              key={c}
              to="/search"
              search={{ q: "", category: c }}
              className="paper-card hover-lift animate-rise flex flex-col gap-2 p-5"
            >
              <LayoutGrid className="size-5 text-primary" />
              <h2 className="font-display text-lg font-semibold leading-snug">{c}</h2>
              <p className="text-sm text-muted-foreground">
                {books.length} books · {avail} available
              </p>
              <p className="text-xs text-muted-foreground">{books[0]?.block}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-primary">
                Browse <ArrowRight className="size-4" />
              </span>
            </Link>
          );
        })}
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold">🗺️ Library Layout</h2>
        <p className="text-sm text-muted-foreground">
          Every book page highlights its exact rack. Here is the full layout, with{" "}
          {sample?.title} shown as an example.
        </p>
        {sample && <LibraryMap book={sample} />}
      </section>
    </div>
  );
}
