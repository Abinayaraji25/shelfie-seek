import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LibraryBig, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLibrary } from "@/lib/library-store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Student Login — Smart Library Book Finder" },
      {
        name: "description",
        content: "Login with your Student ID or college email to search, borrow and return library books.",
      },
      { property: "og:title", content: "Student Login — Smart Library" },
      { property: "og:description", content: "Access your Smart Library student dashboard." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const { login, students } = useLibrary();
  const navigate = useNavigate();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!id.trim() || !password) {
      toast.error("Enter your Student ID / email and password.");
      return;
    }
    const res = login(id, password);
    if (!res.ok) {
      toast.error(res.error ?? "Login failed");
      return;
    }
    toast.success("Welcome back to Smart Library!");
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <div className="animate-rise paper-card p-7 sm:p-9">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
            <LibraryBig className="size-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold">Student Login</h1>
            <p className="text-sm text-muted-foreground">Smart Library Book Finder</p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-7 space-y-5">
          <div>
            <Label className="mb-1.5 block text-sm font-semibold">Student ID / Email</Label>
            <Input value={id} onChange={(e) => setId(e.target.value)} placeholder="22CSE045" />
          </div>
          <div>
            <Label className="mb-1.5 block text-sm font-semibold">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
            />
          </div>
          <Button type="submit" size="lg" className="w-full rounded-full">
            <LogIn className="size-4" /> Login
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full rounded-full text-sm"
            onClick={() =>
              toast.info("Password reset link sent to your college email.", {
                description: "In this demo prototype, please login with the password you registered.",
              })
            }
          >
            Forgot Password?
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New student?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>

        {students.length === 0 && (
          <p className="mt-5 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            No accounts yet on this device — register first to start the demo journey.
          </p>
        )}
      </div>
    </div>
  );
}
