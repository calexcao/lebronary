import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatAmount, formatISBN } from "@/lib/utils";
import { format } from "date-fns";
import PayFineButton from "./PayFineButton";

async function Fines() {
  const session = await auth();

  const results = await prisma.fines.findMany({
    where: {
      user_id: session?.user.id,
      paid_date: null,
    },
    include: {
      borrowings: {
        select: {
          borrow_date: true,
          return_date: true,
          books: {
            select: {
              name: true,
              author: true,
              isbn: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="mt-4">
      {results.length > 0 ? (
        <div className="grid gap-6">
          {results.map((result) => (
            <div
              key={result.borrowing_id}
              className="flex flex-row gap-6 p-6 border rounded-lg"
            >
              <div className="flex-grow space-y-2">
                <h2 className="text-xl font-bold">
                  {result.borrowings.books.name}
                </h2>
                <p className="text-sm">
                  By{" "}
                  <span className="font-medium text-primary">
                    {result.borrowings.books.author}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  ISBN: {formatISBN(result.borrowings.books.isbn)}
                </p>

                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs">Checkout Date</span>
                    <span className="font-medium">
                      {format(result.borrowings.borrow_date, "MMM dd, yyyy")}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs">Return Date</span>
                    <span className="font-medium">
                      {format(result.borrowings.return_date!, "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="self-start">
                <p className="font-bold text-red-400 p-2 border-l-4 border-red-500 rounded">
                  Amount Due:{" "}
                  {formatAmount(result.amount as unknown as number, "CAD")}
                </p>
                <PayFineButton fine_id={result.fine_id} styles="mt-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-secondary/10 rounded-lg p-8 text-center">
          <p className="text-xl font-semibold"> 💰 No fines found</p>
          <p className="text-muted-foreground mt-2">
            You have no outstanding fines. Keep reading and enjoying your books!
          </p>
        </div>
      )}
    </div>
  );
}

export default Fines;
