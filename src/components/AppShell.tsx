import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  BookOpen,
  Heart,
  Home,
  LayoutGrid,
  LibraryBig,
  LogOut,
  Menu,
  Search,
  User,
  X,
} from "lucide-react";
import { useLibrary } from "@/lib/library-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/search", label: "Search Books", icon: Search },
  { to: "/my-books", label: "My Books", icon: BookOpen },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/categories", label: "Categories", icon: LayoutGrid },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { student, ready, logout, activeLoans } = useLibrary();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (ready && !student) navigate({ to: "/login", replace: true });
  }, [ready, student, navigate]);

  useEffect(() => setOpen(false), [pathname]);

  if (!ready || !student) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading your library…
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-card/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <LibraryBig className="size-5" />
            </span>
            <span className="font-display text-lg font-semibold leading-none">
              Smart Library
              <span className="block text-[0.65rem] font-sans font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Book Finder
              </span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground",
                  pathname === to && "bg-primary/10 text-primary",
                )}
              >
                <Icon className="size-4" />
                {label}
                {to === "/my-books" && activeLoans.length > 0 && (
                  <span className="ml-1 rounded-full bg-accent px-1.5 text-[0.65rem] font-bold text-accent-foreground">
                    {activeLoans.length}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-2">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight">{student.name}</p>
              <p className="text-[0.7rem] text-muted-foreground">{student.id}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => {
                logout();
                navigate({ to: "/login", replace: true });
              }}
            >
              <LogOut className="size-4" /> <span className="hidden sm:inline">Logout</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle navigation"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {open && (
          <nav className="grid gap-1 border-t border-border bg-card px-4 py-3 lg:hidden">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium",
                  pathname === to ? "bg-primary/10 text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-4" /> {label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>

      <footer className="mt-8 border-t border-border py-6 text-center text-xs text-muted-foreground">
        Smart Library Book Finder · Design Thinking — Project Better Tomorrow
      </footer>
    </div>
  );
}
