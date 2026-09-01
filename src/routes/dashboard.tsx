import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlarmClock,
  BookOpen,
  CircleCheck,
  Library,
  Search,
  TriangleAlert,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BOOKS, CATEGORIES, getBook } from "@/lib/books";
import { daysLeft, formatDate, loanStatus, useLibrary } from "@/lib/library-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Student Dashboard — Smart Library Book Finder" },
      {
        name: "description",
        content: "Your library at a glance: total books, availability, borrowed books and due-date reminders.",
      },
      { property: "og:title", content: "Student Dashboard — Smart Library" },
      { property: "og:description", content: "Search books and track your loans and due dates." },
    ],
  }),
  component: () => (
    <AppShell>
      <Dashboard />
    </AppShell>
  ),
});

function Dashboard() {
  const { student, activeLoans, isAvailable } = useLibrary();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const availableCount = BOOKS.filter((b) => isAvailable(b)).length;
  const dueSoon = activeLoans.filter((l) => loanStatus(l.dueDate) !== "ok");

  const picks = BOOKS.filter((b) => isAvailable(b)).slice(0, 4);

  return (
    <div className="space-y-10">
      <section className="animate-rise">
        <h1 className="text-3xl font-semibold sm:text-4xl">
          Welcome, {student?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="mt-2 text-muted-foreground">
          {student?.department} · {student?.year} · ID {student?.id}
        </p>

        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/search", search: { q, category: "All" } });
          }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for a book, author, or keyword…"
              className="h-14 rounded-full pl-12 text-base shadow-paper"
            />
          </div>
          <Button type="submit" size="lg" className="h-14 rounded-full px-8">
            Search
          </Button>
        </form>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Library} label="📚 Total Books" value={BOOKS.length} tone="primary" />
        <Stat icon={CircleCheck} label="🟢 Available Books" value={availableCount} tone="success" />
        <Stat icon={BookOpen} label="📖 My Borrowed Books" value={activeLoans.length} tone="accent" />
        <Stat icon={AlarmClock} label="⏰ Books Due Soon" value={dueSoon.length} tone="warning" />
      </section>

      {dueSoon.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold">Due date reminders</h2>
          {dueSoon.map((loan) => {
            const book = getBook(loan.bookId);
            const d = daysLeft(loan.dueDate);
            const overdue = d < 0;
            return (
              <div
                key={loan.id}
                className={cn(
                  "flex flex-wrap items-center gap-3 rounded-xl border p-4",
                  overdue ? "border-destructive/40 bg-destructive/10" : "border-warning/40 bg-warning/10",
                )}
              >
                <TriangleAlert
                  className={cn("size-5", overdue ? "text-destructive" : "text-warning")}
                />
                <div className="flex-1">
                  <p className="font-semibold">{book?.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Due {formatDate(loan.dueDate)} ·{" "}
                    {overdue ? `🔴 Overdue by ${Math.abs(d)} day(s)` : `⚠️ Book due in ${d} day(s)`}
                  </p>
                </div>
                <Button asChild size="sm" variant="outline" className="rounded-full">
                  <Link to="/my-books">Return book</Link>
                </Button>
              </div>
            );
          })}
        </section>
      )}

      <section>
        <h2 className="font-display text-xl font-semibold">Quick categories</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to="/search"
              search={{ q: "", category: c }}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="font-display text-xl font-semibold">Available right now</h2>
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link to="/search" search={{ q: "", category: "All" }}>
              Browse all
            </Link>
          </Button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {picks.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Library;
  label: string;
  value: number;
  tone: "primary" | "success" | "accent" | "warning";
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    accent: "bg-accent/25 text-accent-foreground",
    warning: "bg-warning/20 text-warning",
  } as const;
  return (
    <div className="paper-card hover-lift flex items-center gap-4 p-5">
      <span className={cn("grid size-11 place-items-center rounded-xl", tones[tone])}>
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-display text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
}
