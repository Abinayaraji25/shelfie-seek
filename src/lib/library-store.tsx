import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { BOOKS, type Book } from "./books";

export interface Student {
  id: string; // student id
  name: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  password: string;
}

export interface Loan {
  id: string;
  bookId: string;
  studentId: string;
  borrowDate: string; // ISO date
  dueDate: string;
  returnDate: string | null;
}

interface LibraryState {
  students: Student[];
  currentStudentId: string | null;
  loans: Loan[];
  favorites: Record<string, string[]>;
  notify: Record<string, string[]>;
}

const EMPTY: LibraryState = {
  students: [],
  currentStudentId: null,
  loans: [],
  favorites: {},
  notify: {},
};

const STORAGE_KEY = "smart-library-state-v1";
export const LOAN_DAYS = 14;

const today = () => new Date();
export const iso = (d: Date) => d.toISOString().slice(0, 10);
export const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);

export function formatDate(isoDate: string) {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export function daysLeft(dueDate: string) {
  const due = new Date(dueDate + "T00:00:00").getTime();
  const now = new Date(iso(today()) + "T00:00:00").getTime();
  return Math.round((due - now) / 86400000);
}

export type LoanStatus = "ok" | "due-soon" | "overdue";
export function loanStatus(dueDate: string): LoanStatus {
  const d = daysLeft(dueDate);
  if (d < 0) return "overdue";
  if (d <= 3) return "due-soon";
  return "ok";
}

interface Ctx {
  ready: boolean;
  student: Student | null;
  students: Student[];
  loans: Loan[];
  activeLoans: Loan[];
  history: Loan[];
  favorites: string[];
  notifyList: string[];
  register: (s: Student) => { ok: boolean; error?: string };
  login: (idOrEmail: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  updateProfile: (patch: Partial<Student>) => void;
  isAvailable: (book: Book) => boolean;
  copiesLeft: (book: Book) => number;
  borrow: (bookId: string) => Loan | null;
  returnBook: (loanId: string) => void;
  hasBorrowed: (bookId: string) => boolean;
  toggleFavorite: (bookId: string) => boolean;
  isFavorite: (bookId: string) => boolean;
  toggleNotify: (bookId: string) => boolean;
}

const LibraryContext = createContext<Ctx | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LibraryState>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...EMPTY, ...(JSON.parse(raw) as LibraryState) });
    } catch {
      /* ignore corrupt state */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const student = useMemo(
    () => state.students.find((s) => s.id === state.currentStudentId) ?? null,
    [state.students, state.currentStudentId],
  );

  const myLoans = useMemo(
    () => state.loans.filter((l) => l.studentId === state.currentStudentId),
    [state.loans, state.currentStudentId],
  );
  const activeLoans = useMemo(() => myLoans.filter((l) => !l.returnDate), [myLoans]);
  const history = useMemo(
    () => [...myLoans].sort((a, b) => (a.borrowDate < b.borrowDate ? 1 : -1)),
    [myLoans],
  );

  const favorites = state.currentStudentId ? (state.favorites[state.currentStudentId] ?? []) : [];
  const notifyList = state.currentStudentId ? (state.notify[state.currentStudentId] ?? []) : [];

  const register: Ctx["register"] = useCallback((s) => {
    let error: string | undefined;
    setState((prev) => {
      if (prev.students.some((x) => x.id.toLowerCase() === s.id.toLowerCase())) {
        error = "A student with this Student ID already exists.";
        return prev;
      }
      if (prev.students.some((x) => x.email.toLowerCase() === s.email.toLowerCase())) {
        error = "This college email is already registered.";
        return prev;
      }
      return { ...prev, students: [...prev.students, s] };
    });
    return error ? { ok: false, error } : { ok: true };
  }, []);

  const login: Ctx["login"] = useCallback((idOrEmail, password) => {
    const key = idOrEmail.trim().toLowerCase();
    let error: string | undefined;
    setState((prev) => {
      const found = prev.students.find(
        (s) => s.id.toLowerCase() === key || s.email.toLowerCase() === key,
      );
      if (!found) {
        error = "No account found for that Student ID or email. Please register first.";
        return prev;
      }
      if (found.password !== password) {
        error = "Incorrect password. Please try again.";
        return prev;
      }
      return { ...prev, currentStudentId: found.id };
    });
    return error ? { ok: false, error } : { ok: true };
  }, []);

  const logout = useCallback(() => setState((p) => ({ ...p, currentStudentId: null })), []);

  const updateProfile: Ctx["updateProfile"] = useCallback((patch) => {
    setState((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === prev.currentStudentId ? { ...s, ...patch, id: s.id } : s)),
    }));
  }, []);

  const activeByBook = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of state.loans) {
      if (!l.returnDate) map.set(l.bookId, (map.get(l.bookId) ?? 0) + 1);
    }
    return map;
  }, [state.loans]);

  const copiesLeft = useCallback(
    (book: Book) => Math.max(0, book.copies - (activeByBook.get(book.id) ?? 0)),
    [activeByBook],
  );
  const isAvailable = useCallback((book: Book) => copiesLeft(book) > 0, [copiesLeft]);

  const borrow: Ctx["borrow"] = useCallback(
    (bookId) => {
      const book = BOOKS.find((b) => b.id === bookId);
      if (!book || !state.currentStudentId) return null;
      const now = today();
      const loan: Loan = {
        id: `L${Date.now().toString(36).toUpperCase()}`,
        bookId,
        studentId: state.currentStudentId,
        borrowDate: iso(now),
        dueDate: iso(addDays(now, LOAN_DAYS)),
        returnDate: null,
      };
      setState((prev) => ({ ...prev, loans: [...prev.loans, loan] }));
      return loan;
    },
    [state.currentStudentId],
  );

  const returnBook: Ctx["returnBook"] = useCallback((loanId) => {
    setState((prev) => ({
      ...prev,
      loans: prev.loans.map((l) => (l.id === loanId ? { ...l, returnDate: iso(today()) } : l)),
    }));
  }, []);

  const hasBorrowed = useCallback(
    (bookId: string) => activeLoans.some((l) => l.bookId === bookId),
    [activeLoans],
  );

  const toggleFavorite: Ctx["toggleFavorite"] = useCallback((bookId) => {
    let added = false;
    setState((prev) => {
      const sid = prev.currentStudentId;
      if (!sid) return prev;
      const list = prev.favorites[sid] ?? [];
      added = !list.includes(bookId);
      return {
        ...prev,
        favorites: {
          ...prev.favorites,
          [sid]: added ? [...list, bookId] : list.filter((b) => b !== bookId),
        },
      };
    });
    return added;
  }, []);

  const toggleNotify: Ctx["toggleNotify"] = useCallback((bookId) => {
    let added = false;
    setState((prev) => {
      const sid = prev.currentStudentId;
      if (!sid) return prev;
      const list = prev.notify[sid] ?? [];
      added = !list.includes(bookId);
      return {
        ...prev,
        notify: {
          ...prev.notify,
          [sid]: added ? [...list, bookId] : list.filter((b) => b !== bookId),
        },
      };
    });
    return added;
  }, []);

  const isFavorite = useCallback((bookId: string) => favorites.includes(bookId), [favorites]);

  const value: Ctx = {
    ready,
    student,
    students: state.students,
    loans: state.loans,
    activeLoans,
    history,
    favorites,
    notifyList,
    register,
    login,
    logout,
    updateProfile,
    isAvailable,
    copiesLeft,
    borrow,
    returnBook,
    hasBorrowed,
    toggleFavorite,
    isFavorite,
    toggleNotify,
  };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used inside <LibraryProvider>");
  return ctx;
}
