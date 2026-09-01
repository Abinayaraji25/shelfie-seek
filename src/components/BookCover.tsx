import { coverTone, type Book } from "@/lib/books";
import { cn } from "@/lib/utils";

const TONES = [
  "from-chart-1/85 to-chart-1/55",
  "from-chart-2/85 to-chart-2/55",
  "from-chart-3/85 to-chart-3/55",
  "from-chart-4/85 to-chart-4/55",
  "from-chart-5/85 to-chart-5/55",
  "from-primary/85 to-primary/55",
];

export function BookCover({
  book,
  className,
  size = "md",
}: {
  book: Book;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const tone = TONES[coverTone(book.id)] ?? TONES[0];
  const text = size === "lg" ? "text-lg" : size === "md" ? "text-sm" : "text-xs";

  return (
    <div
      className={cn(
        "relative flex aspect-[3/4] w-full flex-col justify-between overflow-hidden rounded-lg bg-gradient-to-br p-3 text-card",
        tone,
        className,
      )}
    >
      <div className="absolute inset-y-0 left-0 w-2 bg-foreground/20 spine" />
      <span className="ml-2 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-card/80">
        {book.category}
      </span>
      <div className="ml-2">
        <p className={cn("font-display font-semibold leading-tight text-card drop-shadow", text)}>
          {book.title}
        </p>
        <p className="mt-1 text-[0.65rem] font-medium text-card/85">{book.author}</p>
      </div>
      <span className="ml-2 text-[0.6rem] font-mono text-card/70">{book.id}</span>
    </div>
  );
}
