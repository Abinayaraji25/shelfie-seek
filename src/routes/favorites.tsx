import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, HeartOff } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { AvailabilityBadge } from "@/components/BookCard";
import { BookCover } from "@/components/BookCover";
import { Button } from "@/components/ui/button";
import { getBook } from "@/lib/books";
import { useLibrary } from "@/lib/library-store";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "My Favorites — Smart Library Book Finder" },
      {
        name: "description",
        content: "Your saved library books, ready to borrow when you need them.",
      },
      { property: "og:title", content: "My Favorites — Smart Library" },
      { property: "og:description", content: "Books you saved for later." },
    ],
  }),
  component: () => (
    <AppShell>
      <Favorites />
    </AppShell>
  ),
});

function Favorites() {
  const { favorites, toggleFavorite, isAvailable } = useLibrary();
  const books = favorites.map(getBook).filter((b): b is NonNullable<typeof b> => !!b);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">My Favorites ❤️</h1>
        <p className="mt-2 text-muted-foreground">{books.length} saved book(s).</p>
      </div>

      {books.length === 0 ? (
        <div className="paper-card flex flex-col items-center gap-3 p-12 text-center">
          <Heart className="size-10 text-muted-foreground" />
          <p className="font-display text-lg font-semibold">No favorites yet</p>
          <p className="text-sm text-muted-foreground">
            Tap “❤️ Add to Favorites” on any book to save it here.
          </p>
          <Button asChild className="mt-2 rounded-full">
            <Link to="/search" search={{ q: "", category: "All" }}>
              Browse books
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {books.map((book) => (
            <div key={book.id} className="paper-card animate-rise flex flex-col gap-4 p-4 sm:flex-row">
              <Link to="/books/$bookId" params={{ bookId: book.id }} className="w-24 shrink-0">
                <BookCover book={book} size="sm" />
              </Link>
              <div className="flex-1 space-y-1.5">
                <Link
                  to="/books/$bookId"
                  params={{ bookId: book.id }}
                  className="font-display text-lg font-semibold hover:text-primary"
                >
                  {book.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {book.author} · {book.category}
                </p>
                <p className="text-xs text-muted-foreground">
                  📍 {book.block} → {book.rack} → {book.shelf}
                </p>
                <AvailabilityBadge available={isAvailable(book)} />
              </div>
              <div className="flex flex-col justify-center gap-2">
                <Button asChild size="sm" className="rounded-full">
                  <Link to="/books/$bookId" params={{ bookId: book.id }}>
                    View Details
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => {
                    toggleFavorite(book.id);
                    toast.success("Removed from Favorites");
                  }}
                >
                  <HeartOff className="size-4" /> Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
