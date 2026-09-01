import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Receipt as ReceiptIcon, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { BookCover } from "@/components/BookCover";
import { Receipt } from "@/components/Receipt";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getBook } from "@/lib/books";
import { daysLeft, formatDate, loanStatus, useLibrary, type Loan } from "@/lib/library-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/my-books")({
  head: () => ({
    meta: [
      { title: "My Books — Smart Library Book Finder" },
      {
        name: "description",
        content: "Track currently borrowed books, due dates, digital receipts and your full borrowing history.",
      },
      { property: "og:title", content: "My Books — Smart Library" },
      { property: "og:description", content: "Borrowed books, due dates and borrowing history." },
    ],
  }),
  component: () => (
    <AppShell>
      <MyBooks />
    </AppShell>
  ),
});

function MyBooks() {
  const { activeLoans, history, returnBook, student } = useLibrary();
  const [pendingReturn, setPendingReturn] = useState<Loan | null>(null);
  const [showReceipt, setShowReceipt] = useState<Loan | null>(null);

  const receiptBook = showReceipt ? getBook(showReceipt.bookId) : undefined;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">My Books</h1>
        <p className="mt-2 text-muted-foreground">
          {activeLoans.length} book{activeLoans.length === 1 ? "" : "s"} currently with you.
        </p>
      </div>

      <Tabs defaultValue="current">
        <TabsList className="rounded-full">
          <TabsTrigger value="current" className="rounded-full">
            Currently Borrowed
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-full">
            Borrowing History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-6 space-y-4">
          {activeLoans.length === 0 ? (
            <Empty />
          ) : (
            activeLoans.map((loan) => {
              const book = getBook(loan.bookId);
              if (!book) return null;
              const status = loanStatus(loan.dueDate);
              const d = daysLeft(loan.dueDate);
              return (
                <div key={loan.id} className="paper-card animate-rise flex flex-col gap-4 p-4 sm:flex-row">
                  <Link to="/books/$bookId" params={{ bookId: book.id }} className="w-24 shrink-0">
                    <BookCover book={book} size="sm" />
                  </Link>
                  <div className="flex-1 space-y-1.5">
                    <Link
                      to="/books/$bookId"
                      params={{ bookId: book.id }}
                      className="font-display text-lg font-semibold hover:text-primary"
                    >
                      {book.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                    <p className="text-sm text-muted-foreground">
                      Borrowed {formatDate(loan.borrowDate)} · Due {formatDate(loan.dueDate)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      📍 {book.block} → {book.rack} → {book.shelf}
                    </p>
                    <StatusPill status={status} days={d} />
                  </div>
                  <div className="flex flex-col justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => setShowReceipt(loan)}
                    >
                      <ReceiptIcon className="size-4" /> Receipt
                    </Button>
                    <Button size="sm" className="rounded-full" onClick={() => setPendingReturn(loan)}>
                      <RotateCcw className="size-4" /> Return Book
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          {history.length === 0 ? (
            <Empty />
          ) : (
            <div className="paper-card overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Borrowed</TableHead>
                    <TableHead>Returned</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((loan) => {
                    const book = getBook(loan.bookId);
                    return (
                      <TableRow key={loan.id}>
                        <TableCell className="font-medium">{book?.title}</TableCell>
                        <TableCell>{formatDate(loan.borrowDate)}</TableCell>
                        <TableCell>{loan.returnDate ? formatDate(loan.returnDate) : "—"}</TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-1 text-xs font-semibold",
                              loan.returnDate
                                ? "bg-muted text-muted-foreground"
                                : "bg-success/15 text-success",
                            )}
                          >
                            {loan.returnDate ? "Returned" : "Borrowed"}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!pendingReturn} onOpenChange={(o) => !o && setPendingReturn(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Return Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to return “{pendingReturn && getBook(pendingReturn.bookId)?.title}”?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full"
              onClick={() => {
                if (!pendingReturn) return;
                returnBook(pendingReturn.id);
                setPendingReturn(null);
                toast.success("🟢 Book returned successfully!", {
                  description: "It is now available for other students.",
                });
              }}
            >
              Yes, Return Book
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!showReceipt} onOpenChange={(o) => !o && setShowReceipt(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Digital Borrowing Receipt</DialogTitle>
          </DialogHeader>
          {showReceipt && receiptBook && student && (
            <Receipt loan={showReceipt} book={receiptBook} student={student} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusPill({ status, days }: { status: ReturnType<typeof loanStatus>; days: number }) {
  const map = {
    ok: { cls: "bg-success/15 text-success", text: `🟢 Borrowed · ${days} days left` },
    "due-soon": { cls: "bg-warning/20 text-warning", text: `⚠️ Due in ${days} day(s)` },
    overdue: { cls: "bg-destructive/15 text-destructive", text: `🔴 Overdue by ${Math.abs(days)} day(s)` },
  } as const;
  const s = map[status];
  return (
    <span className={cn("inline-block rounded-full px-2.5 py-1 text-xs font-semibold", s.cls)}>
      {s.text}
    </span>
  );
}

function Empty() {
  return (
    <div className="paper-card flex flex-col items-center gap-3 p-12 text-center">
      <BookOpen className="size-10 text-muted-foreground" />
      <p className="font-display text-lg font-semibold">Nothing here yet</p>
      <p className="text-sm text-muted-foreground">Search the library and borrow your first book.</p>
      <Button asChild className="mt-2 rounded-full">
        <Link to="/search" search={{ q: "", category: "All" }}>
          Search books
        </Link>
      </Button>
    </div>
  );
}
