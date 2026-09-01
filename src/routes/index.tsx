import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { BookOpen, LibraryBig, MapPin, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BOOKS } from "@/lib/books";
import { useLibrary } from "@/lib/library-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Library Book Finder — Find any college library book" },
      {
        name: "description",
        content:
          "Register, search 60+ library books by title, author or keyword, see live availability, get the exact rack and shelf, then borrow and return in a click.",
      },
      { property: "og:title", content: "Smart Library Book Finder" },
      {
        property: "og:description",
        content: "A smart college library system: search, locate, borrow and return books.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { student, ready } = useLibrary();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && student) navigate({ to: "/dashboard", replace: true });
  }, [ready, student, navigate]);

  const available = BOOKS.filter((b) => b.available).length;

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <LibraryBig className="size-5" />
          </span>
          <span className="font-display text-lg font-semibold">Smart Library</span>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-2 lg:py-20">
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/25 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground">
            <Sparkles className="size-3.5" /> College Library, made simple
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
            Find the exact shelf your book is sitting on.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
            Smart Library Book Finder lets students search {BOOKS.length} academic and story books, check
            live availability, walk straight to the right block, rack and shelf, then borrow, track due
            dates and return — all in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/register">Create student account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link to="/login">I already have an account</Link>
            </Button>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 text-center">
            {[
              { k: "Books", v: BOOKS.length },
              { k: "Available now", v: available },
              { k: "Categories", v: 8 },
            ].map((s) => (
              <div key={s.k} className="paper-card p-4">
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">{s.k}</dt>
                <dd className="font-display text-2xl font-semibold">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: Search,
              title: "Smart search",
              body: "Partial titles, author names, keywords and even typos — “Jvaa” still finds Java.",
            },
            {
              icon: MapPin,
              title: "Rack & shelf map",
              body: "A visual Library → Block → Rack → Shelf trail highlights the exact spot.",
            },
            {
              icon: BookOpen,
              title: "Borrow & return",
              body: "14-day loans, digital receipts, due-date reminders and one-click returns.",
            },
            {
              icon: Sparkles,
              title: "Recommendations",
              body: "Book unavailable? Get notified and see three similar titles instantly.",
            },
          ].map((f) => (
            <div key={f.title} className="paper-card hover-lift p-5">
              <f.icon className="size-6 text-primary" />
              <h2 className="mt-3 font-display text-lg font-semibold">{f.title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
