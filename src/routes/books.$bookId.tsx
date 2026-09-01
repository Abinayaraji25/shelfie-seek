import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  CalendarClock,
  Heart,
  Layers,
  Library,
  PartyPopper,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { AvailabilityBadge, BookCard } from "@/components/BookCard";
import { BookCover } from "@/components/BookCover";
import { LibraryMap } from "@/components/LibraryMap";
import { Receipt } from "@/components/Receipt";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getBook, similarBooks } from "@/lib/books";
import {
  addDays,
  formatDate,
  iso,
  LOAN_DAYS,
  useLibrary,
  type Loan,
} from "@/lib/library-store";

export const Route = createFileRoute("/books/$bookId")({
  loader: ({ params }) => {
    const book = getBook(params.bookId);
    if (!book) throw notFound();
    return { book };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Book not found — Smart Library" }, { name: "robots", content: "noindex" }],
      };
    }
    const { book } = loaderData;
    const title = `${book.title} — Smart Library Book Finder`;
    const description = `${book.title} by ${book.author}. ${book.block}, rack ${book.rack}, shelf ${book.shelf}. ${book.description}`;
    return {
      meta: [
        { title },
        { name: "description", content: description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: description.slice(0, 155) },
      ],
    };
  },
  component: () => (
    <AppShell>
      <BookDetail />
    </AppShell>
  ),
});

function BookDetail() {
  const { book } = Route.useLoaderData();
  const {
    student,
    isAvailable,
    copiesLeft,
    borrow,
    hasBorrowed,
    isFavorite,
    toggleFavorite,
    toggleNotify,
    notifyList,
  } = useLibrary();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [receipt, setReceipt] = useState<Loan | null>(null);

  const available = isAvailable(book);
  const alreadyMine = hasBorrowed(book.id);
  const similar = similarBooks(book, 3, !available);
  const borrowDate = iso(new Date());
  const dueDate = iso(addDays(new Date(), LOAN_DAYS));

  function doBorrow() {
    const loan = borrow(book.id);
    setConfirmOpen(false);
    if (!loan) return;
    setReceipt(loan);
    toast.success("🎉 Book Borrowed Successfully!", {
      description: `${book.title} · Rack ${book.rack} · Shelf ${book.shelf} · due ${formatDate(loan.dueDate)}`,
    });
  }

  return (
    <div className="space-y-8">
      <Button variant="ghost" size="sm" className="rounded-full" onClick={() => navigate({ to: "/search", search: { q: "", category: "All" } })}>
        <ArrowLeft className="size-4" /> Back to search
      </Button>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="animate-rise mx-auto w-full max-w-[280px]">
          <BookCover book={book} size="lg" className="shadow-lift" />
        </div>

        <div className="animate-rise space-y-5">
          <div className="space-y-2">
            <Badge variant="secondary" className="rounded-full">
              {book.category}
            </Badge>
            <h1 className="text-3xl font-semibold sm:text-4xl">{book.title}</h1>
            <p className="text-lg text-muted-foreground">by {book.author}</p>
            <p className="font-mono text-xs text-muted-foreground">Book ID: {book.id}</p>
          </div>

          <p className="max-w-2xl leading-relaxed text-muted-foreground">{book.description}</p>

          <div className="flex flex-wrap items-center gap-3">
            {available ? (
              <>
                <AvailabilityBadge available />
                <span className="text-sm text-muted-foreground">
                  {copiesLeft(book)} of {book.copies} copies on the shelf
                </span>
              </>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/15 px-3 py-1.5 text-sm font-semibold text-destructive">
                <span className="size-2 rounded-full bg-destructive" /> 🔴 Currently Unavailable
              </span>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Info icon={Library} label="Block" value={book.block} />
            <Info icon={Library} label="Rack" value={book.rack} />
            <Info icon={Layers} label="Shelf" value={book.shelf} />
          </div>

          <div className="flex flex-wrap gap-3">
            {available && !alreadyMine && (
              <Button size="lg" className="rounded-full" onClick={() => setConfirmOpen(true)}>
                <BookOpen className="size-4" /> 📚 Borrow Book
              </Button>
            )}
            {alreadyMine && (
              <Button asChild size="lg" variant="secondary" className="rounded-full">
                <Link to="/my-books">Already borrowed — view in My Books</Link>
              </Button>
            )}
            {!available && (
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full"
                onClick={() => {
                  const added = toggleNotify(book.id);
                  toast[added ? "success" : "info"](
                    added
                      ? "🔔 We'll notify you when this book is back."
                      : "Notification removed for this book.",
                  );
                }}
              >
                <Bell className="size-4" />
                {notifyList.includes(book.id) ? "Notification on" : "🔔 Notify Me When Available"}
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              className="rounded-full"
              onClick={() => {
                const added = toggleFavorite(book.id);
                toast.success(added ? "❤️ Added to Favorites" : "Removed from Favorites");
              }}
            >
              <Heart className={`size-4 ${isFavorite(book.id) ? "fill-destructive text-destructive" : ""}`} />
              {isFavorite(book.id) ? "In Favorites" : "❤️ Add to Favorites"}
            </Button>
          </div>
        </div>
      </div>

      <LibraryMap book={book} />

      {receipt && student && (
        <section className="paper-card space-y-4 p-6">
          <div className="flex items-center gap-2">
            <PartyPopper className="size-5 text-success" />
            <h2 className="font-display text-xl font-semibold">Book Borrowed Successfully!</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <Info icon={Library} label="Rack" value={book.rack} />
            <Info icon={Layers} label="Shelf" value={book.shelf} />
            <Info icon={CalendarClock} label="Borrow Date" value={formatDate(receipt.borrowDate)} />
            <Info icon={CalendarClock} label="Due Date" value={formatDate(receipt.dueDate)} />
          </div>
          <Receipt loan={receipt} book={book} student={student} />
          <Button asChild variant="secondary" className="rounded-full">
            <Link to="/my-books">Go to My Books</Link>
          </Button>
        </section>
      )}

      {similar.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-semibold">
            📚 {available ? "You may also like" : "Similar Books available now"}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </section>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Confirm Borrowing</DialogTitle>
            <DialogDescription>
              Loans run for {LOAN_DAYS} days. Please return on or before the due date.
            </DialogDescription>
          </DialogHeader>
          <dl className="grid gap-3 rounded-xl bg-muted p-4 text-sm">
            <Line label="Book" value={book.title} />
            <Line label="Student" value={student?.name ?? ""} />
            <Line label="Borrow Date" value={formatDate(borrowDate)} />
            <Line label="Due Date" value={formatDate(dueDate)} />
            <Line label="Pick up at" value={`${book.block} → ${book.rack} → ${book.shelf}`} />
          </dl>
          <DialogFooter>
            <Button variant="outline" className="rounded-full" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button className="rounded-full" onClick={doBorrow}>
              Confirm Borrow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Library;
  label: string;
  value: string;
}) {
  return (
    <div className="paper-card flex items-center gap-3 p-4">
      <Icon className="size-5 text-primary" />
      <div>
        <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
