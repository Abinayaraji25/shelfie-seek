import { useRef } from "react";
import { Download, LibraryBig } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Book } from "@/lib/books";
import { formatDate, type Loan, type Student } from "@/lib/library-store";

export function Receipt({ loan, book, student }: { loan: Loan; book: Book; student: Student }) {
  const ref = useRef<HTMLDivElement>(null);

  function download() {
    const lines = [
      "SMART LIBRARY — BORROWING RECEIPT",
      "==================================",
      `Receipt No : ${loan.id}`,
      `Student    : ${student.name}`,
      `Student ID : ${student.id}`,
      `Department : ${student.department} (${student.year})`,
      "",
      `Book       : ${book.title}`,
      `Book ID    : ${book.id}`,
      `Author     : ${book.author}`,
      `Location   : ${book.block} > Rack ${book.rack} > Shelf ${book.shelf}`,
      "",
      `Borrow Date: ${formatDate(loan.borrowDate)}`,
      `Due Date   : ${formatDate(loan.dueDate)}`,
      `Status     : ${loan.returnDate ? `Returned on ${formatDate(loan.returnDate)}` : "Borrowed"}`,
      "",
      "Please return on or before the due date. Happy reading!",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([lines], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `library-receipt-${loan.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div
        ref={ref}
        className="overflow-hidden rounded-xl border border-dashed border-primary/40 bg-card"
      >
        <div className="flex items-center gap-2 bg-primary px-4 py-3 text-primary-foreground">
          <LibraryBig className="size-4" />
          <p className="font-display text-sm font-semibold tracking-wide">
            📚 Library Borrowing Receipt
          </p>
          <span className="ml-auto font-mono text-[0.7rem] opacity-80">{loan.id}</span>
        </div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 p-4 text-sm">
          <Row label="Student Name" value={student.name} />
          <Row label="Student ID" value={student.id} />
          <Row label="Book Title" value={book.title} wide />
          <Row label="Book ID" value={book.id} />
          <Row label="Author" value={book.author} />
          <Row label="Borrow Date" value={formatDate(loan.borrowDate)} />
          <Row label="Due Date" value={formatDate(loan.dueDate)} />
          <Row label="Location" value={`${book.block} → ${book.rack} → ${book.shelf}`} wide />
          <div className="col-span-2">
            <dt className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">Status</dt>
            <dd>
              <span
                className={
                  loan.returnDate
                    ? "inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground"
                    : "inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success"
                }
              >
                <span
                  className={`size-2 rounded-full ${loan.returnDate ? "bg-muted-foreground" : "bg-success"}`}
                />
                {loan.returnDate ? `Returned ${formatDate(loan.returnDate)}` : "Borrowed"}
              </span>
            </dd>
          </div>
        </dl>
      </div>
      <Button variant="outline" className="w-full rounded-full" onClick={download}>
        <Download className="size-4" /> Download Receipt
      </Button>
    </div>
  );
}

function Row({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <dt className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
