import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, SearchX } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES, searchBooks, suggestTerm, type Category } from "@/lib/books";
import { cn } from "@/lib/utils";

type SearchParams = { q: string; category: Category | "All" };

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    const cat = String(search["category"] ?? "All");
    return {
      q: typeof search["q"] === "string" ? (search["q"] as string).slice(0, 80) : "",
      category: (CATEGORIES as string[]).includes(cat) ? (cat as Category) : "All",
    };
  },
  head: () => ({
    meta: [
      { title: "Search Books — Smart Library Book Finder" },
      {
        name: "description",
        content:
          "Smart search across the college library by title, author, keyword or category, with typo suggestions and live availability.",
      },
      { property: "og:title", content: "Search Books — Smart Library" },
      { property: "og:description", content: "Find books by title, author or keyword instantly." },
    ],
  }),
  component: () => (
    <AppShell>
      <SearchPage />
    </AppShell>
  ),
});

function SearchPage() {
  const { q, category } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const [input, setInput] = useState(q);

  useEffect(() => setInput(q), [q]);

  const results = searchBooks(q, category);
  const suggestion = results.length === 0 || q.length > 2 ? suggestTerm(q) : null;

  const apply = (next: Partial<SearchParams>) =>
    navigate({ search: (prev) => ({ ...prev, ...next }) });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Search Books</h1>
        <p className="mt-2 text-muted-foreground">
          Try “Harry”, “Rowling”, “Java”, “programming” — partial words and typos work too.
        </p>
      </div>

      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          apply({ q: input });
        }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search for a book, author, or keyword…"
            className="h-13 rounded-full pl-12 text-base"
            maxLength={80}
          />
        </div>
        <Button type="submit" size="lg" className="rounded-full px-8">
          Search
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        {(["All", ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => apply({ category: c })}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              category === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {suggestion && (
        <p className="rounded-xl bg-accent/20 p-4 text-sm">
          Did you mean{" "}
          <button
            className="font-semibold text-primary underline"
            onClick={() => apply({ q: suggestion })}
          >
            “{suggestion}”
          </button>
          ?
        </p>
      )}

      <p className="text-sm text-muted-foreground">
        {results.length} book{results.length === 1 ? "" : "s"} found
        {q ? ` for “${q}”` : ""}
        {category !== "All" ? ` in ${category}` : ""}.
      </p>

      {results.length === 0 ? (
        <div className="paper-card flex flex-col items-center gap-3 p-12 text-center">
          <SearchX className="size-10 text-muted-foreground" />
          <p className="font-display text-lg font-semibold">No books matched your search</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Check the spelling, use fewer words, or browse a category above.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      )}
    </div>
  );
}
