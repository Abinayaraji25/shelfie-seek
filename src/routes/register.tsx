import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LibraryBig, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLibrary } from "@/lib/library-store";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Student Registration — Smart Library Book Finder" },
      {
        name: "description",
        content: "Create your Smart Library student account to search, borrow and track college library books.",
      },
      { property: "og:title", content: "Student Registration — Smart Library" },
      { property: "og:description", content: "Register with your college email and student ID." },
    ],
  }),
  component: RegisterPage,
});

const DEPARTMENTS = [
  "Computer Science and Engineering",
  "Information Technology",
  "Artificial Intelligence & Data Science",
  "Electronics and Communication",
  "Electrical and Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
  "Business Administration",
];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const schema = z
  .object({
    name: z.string().trim().min(3, "Please enter your full name").max(80),
    id: z
      .string()
      .trim()
      .min(3, "Student ID must be at least 3 characters")
      .max(20, "Student ID is too long"),
    email: z.string().trim().email("Enter a valid college email").max(120),
    phone: z
      .string()
      .trim()
      .regex(/^[0-9+\-\s]{10,15}$/, "Enter a valid phone number"),
    department: z.string().min(1, "Please select your department"),
    year: z.string().min(1, "Please select your year of study"),
    password: z.string().min(6, "Password must be at least 6 characters").max(64),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

type Form = z.infer<typeof schema>;

const EMPTY: Form = {
  name: "",
  id: "",
  email: "",
  phone: "",
  department: "",
  year: "",
  password: "",
  confirm: "",
};

function RegisterPage() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const { register } = useLibrary();
  const navigate = useNavigate();

  const set = (k: keyof Form) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Partial<Record<keyof Form, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Form;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    const { confirm, ...rest } = parsed.data;
    void confirm;
    const res = register(rest);
    if (!res.ok) {
      toast.error(res.error ?? "Registration failed");
      return;
    }
    toast.success("Registration successful! Welcome to Smart Library.", {
      description: "Please login with your Student ID and password.",
    });
    navigate({ to: "/login" });
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 py-10">
      <div className="animate-rise paper-card p-6 sm:p-9">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
            <LibraryBig className="size-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold">Student Registration</h1>
            <p className="text-sm text-muted-foreground">
              Join Smart Library Book Finder in under a minute.
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-7 grid gap-5 sm:grid-cols-2">
          <Field label="Full Name" error={errors.name} className="sm:col-span-2">
            <Input
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
              placeholder="Abinayaraji S"
              maxLength={80}
            />
          </Field>
          <Field label="Student ID" error={errors.id}>
            <Input
              value={form.id}
              onChange={(e) => set("id")(e.target.value)}
              placeholder="22CSE045"
              maxLength={20}
            />
          </Field>
          <Field label="College Email" error={errors.email}>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set("email")(e.target.value)}
              placeholder="abinayaraji@college.edu"
              maxLength={120}
            />
          </Field>
          <Field label="Phone Number" error={errors.phone}>
            <Input
              value={form.phone}
              onChange={(e) => set("phone")(e.target.value)}
              placeholder="9876543210"
              maxLength={15}
            />
          </Field>
          <Field label="Year of Study" error={errors.year}>
            <Select value={form.year} onValueChange={set("year")}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Department" error={errors.department} className="sm:col-span-2">
            <Select value={form.department} onValueChange={set("department")}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Password" error={errors.password}>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => set("password")(e.target.value)}
              placeholder="At least 6 characters"
            />
          </Field>
          <Field label="Confirm Password" error={errors.confirm}>
            <Input
              type="password"
              value={form.confirm}
              onChange={(e) => set("confirm")(e.target.value)}
              placeholder="Re-enter password"
            />
          </Field>

          <div className="sm:col-span-2">
            <Button type="submit" size="lg" className="w-full rounded-full">
              <UserPlus className="size-4" /> Create Account
            </Button>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-sm font-semibold">{label}</Label>
      {children}
      {error && <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
