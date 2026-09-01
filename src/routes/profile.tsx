import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Pencil, Save, User, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { BookCover } from "@/components/BookCover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getBook } from "@/lib/books";
import { useLibrary } from "@/lib/library-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Smart Library Book Finder" },
      {
        name: "description",
        content: "Your student profile: department, year, borrowing stats and favorite books.",
      },
      { property: "og:title", content: "My Profile — Smart Library" },
      { property: "og:description", content: "Student details and borrowing summary." },
    ],
  }),
  component: () => (
    <AppShell>
      <Profile />
    </AppShell>
  ),
});

function Profile() {
  const { student, activeLoans, history, favorites, updateProfile } = useLibrary();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: student?.name ?? "",
    email: student?.email ?? "",
    phone: student?.phone ?? "",
    department: student?.department ?? "",
    year: student?.year ?? "",
  });

  if (!student) return null;
  const returned = history.filter((l) => l.returnDate).length;
  const favBooks = favorites.map(getBook).filter((b): b is NonNullable<typeof b> => !!b);

  function save() {
    if (form.name.trim().length < 3) {
      toast.error("Name must be at least 3 characters.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast.error("Enter a valid email address.");
      return;
    }
    updateProfile({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      department: form.department.trim(),
      year: form.year.trim(),
    });
    setEditing(false);
    toast.success("Profile updated successfully.");
  }

  return (
    <div className="space-y-8">
      <div className="paper-card animate-rise flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-primary text-2xl font-semibold text-primary-foreground">
          {student.name.charAt(0).toUpperCase()}
        </span>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-semibold">{student.name}</h1>
          <p className="text-sm text-muted-foreground">
            {student.id} · {student.department} · {student.year}
          </p>
          <p className="text-sm text-muted-foreground">
            {student.email} · {student.phone}
          </p>
        </div>
        <Button
          variant={editing ? "outline" : "default"}
          className="rounded-full"
          onClick={() => setEditing((e) => !e)}
        >
          {editing ? <X className="size-4" /> : <Pencil className="size-4" />}
          {editing ? "Cancel" : "Edit profile"}
        </Button>
      </div>

      {editing && (
        <div className="paper-card grid gap-5 p-6 sm:grid-cols-2">
          {(
            [
              ["name", "Full Name"],
              ["email", "College Email"],
              ["phone", "Phone Number"],
              ["department", "Department"],
              ["year", "Year of Study"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <Label className="mb-1.5 block text-sm font-semibold">{label}</Label>
              <Input
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                maxLength={120}
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <Button className="rounded-full" onClick={save}>
              <Save className="size-4" /> Save changes
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Currently borrowed" value={activeLoans.length} />
        <Stat label="Books returned" value={returned} />
        <Stat label="Favorite books" value={favorites.length} />
      </div>

      <section>
        <h2 className="font-display text-xl font-semibold">Favorite books ❤️</h2>
        {favBooks.length === 0 ? (
          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Heart className="size-4" /> Nothing saved yet.{" "}
            <Link to="/search" search={{ q: "", category: "All" }} className="text-primary underline">
              Find a book
            </Link>
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-6">
            {favBooks.map((b) => (
              <Link key={b.id} to="/books/$bookId" params={{ bookId: b.id }} className="hover-lift">
                <BookCover book={b} size="sm" />
              </Link>
            ))}
          </div>
        )}
      </section>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <User className="size-3.5" /> Student ID cannot be changed — contact the library desk for
        corrections.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="paper-card p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}
