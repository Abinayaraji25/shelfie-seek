import { Link } from "@tanstack/react-router";
import { Library, Layers, ArrowRight, Heart } from "lucide-react";
import type { Book } from "@/lib/books";
import { useLibrary } from "@/lib/library-store";
import { BookCover } from "./BookCover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function AvailabilityBadge({ available }: { available: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        available ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
      )}
    >
      <span className={cn("size-2 rounded-full", available ? "bg-success" : "bg-destructive")} />
      {available ? "Available" : "Unavailable"}
    </span>
  );
}

export function BookCard({ book }: { book: Book }) {
  const { isAvailable, isFavorite, copiesLeft } = useLibrary();
  const available = isAvailable(book);

  return (
    <article className="paper-card hover-lift animate-rise flex flex-col gap-3 p-3">
      <div className="relative">
        <BookCover book={book} />
        {isFavorite(book.id) && (
          <span className="absolute right-2 top-2 rounded-full bg-card/90 p-1.5 text-destructive shadow">
            <Heart className="size-3.5 fill-current" />
          </span>
        )}
      </div>
      <div className="flex-1 space-y-1.5">
        <h3 className="font-display text-base font-semibold leading-snug">{book.title}</h3>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        <Badge variant="secondary" className="rounded-full text-[0.7rem]">
          {book.category}
        </Badge>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Library className="size-3.5" /> {book.rack}
        </span>
        <span className="inline-flex items-center gap-1">
          <Layers className="size-3.5" /> {book.shelf}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <AvailabilityBadge available={available} />
        {available && <span className="text-[0.7rem] text-muted-foreground">{copiesLeft(book)} copies</span>}
      </div>
      <Button asChild size="sm" className="w-full rounded-full">
        <Link to="/books/$bookId" params={{ bookId: book.id }}>
          View Details <ArrowRight className="size-4" />
        </Link>
      </Button>
    </article>
  );
}
