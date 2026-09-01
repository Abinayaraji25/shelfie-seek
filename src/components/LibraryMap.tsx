import { MapPin } from "lucide-react";
import { BLOCKS, RACKS, type Book } from "@/lib/books";
import { cn } from "@/lib/utils";

export function LibraryMap({ book }: { book: Book }) {
  return (
    <div className="paper-card p-5">
      <div className="flex items-center gap-2">
        <MapPin className="size-4 text-primary" />
        <h3 className="font-display text-lg font-semibold">Library Map</h3>
      </div>

      <p className="mt-2 flex flex-wrap items-center gap-2 text-sm font-medium">
        <span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">Library</span>
        <span className="text-muted-foreground">→</span>
        <span className="rounded-full bg-primary px-3 py-1 text-primary-foreground">{book.block}</span>
        <span className="text-muted-foreground">→</span>
        <span className="rounded-full bg-primary px-3 py-1 text-primary-foreground">Rack {book.rack}</span>
        <span className="text-muted-foreground">→</span>
        <span className="rounded-full bg-accent px-3 py-1 text-accent-foreground">Shelf {book.shelf}</span>
      </p>

      <div className="mt-5 space-y-4">
        {BLOCKS.map((block) => {
          const isBlock = block === book.block;
          return (
            <div
              key={block}
              className={cn(
                "rounded-xl border p-3 transition-colors",
                isBlock ? "border-primary bg-primary/5" : "border-border bg-muted/40",
              )}
            >
              <p
                className={cn(
                  "mb-2 text-sm font-semibold",
                  isBlock ? "text-primary" : "text-muted-foreground",
                )}
              >
                {block} {isBlock && "· your book is here"}
              </p>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                {RACKS.map((rack) => {
                  const hit = isBlock && rack === book.rack;
                  return (
                    <div
                      key={rack}
                      className={cn(
                        "rounded-lg border px-1 py-2 text-center text-[0.7rem] font-semibold transition-all",
                        hit
                          ? "scale-105 border-accent bg-accent text-accent-foreground shadow-lift"
                          : "border-border bg-card text-muted-foreground",
                      )}
                    >
                      {rack}
                      {hit && <span className="block text-[0.6rem] font-bold">{book.shelf}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
        Walk into <strong className="text-foreground">{book.block}</strong>, find rack{" "}
        <strong className="text-foreground">{book.rack}</strong>, then look at shelf{" "}
        <strong className="text-foreground">{book.shelf}</strong> (shelves are numbered top to bottom).
      </p>
    </div>
  );
}
