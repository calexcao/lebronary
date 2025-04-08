import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatISBN } from "@/lib/utils";
import { differenceInCalendarDays, format } from "date-fns";
import Image from "next/image";

async function Checkout() {
  const session = await auth();

  const results = await prisma.borrowings.findMany({
    where: {
      user_id: session?.user.id,
      return_date: null,
    },
    include: {
      books: {
        select: {
          name: true,
          author: true,
          isbn: true,
          book_photos: {
            select: { url: true },
          },
        },
      },
    },
  });

  const dueDate = (date: Date) => {
    return differenceInCalendarDays(date, new Date());
  };

  return (
    <div className="mt-4">
      {results.length > 0 ? (
        <div className="grid gap-6">
          {results.map((result) => (
            <div
              key={result.borrowing_id}
              className="flex flex-row gap-6 p-6 border rounded-lg"
            >
              <Image
                className="rounded-md h-auto object-cover"
                src={result.books.book_photos[0].url}
                alt={result.books.name}
                width={120}
                height={180}
                priority={true}
              />

              <div className="flex-grow space-y-2">
                <h2 className="text-xl font-bold">{result.books?.name}</h2>
                <p className="text-sm">
                  By{" "}
                  <span className="font-medium text-primary">
                    {result.books.author}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  ISBN: {formatISBN(result.books.isbn)}
                </p>

                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs">Checkout Date</span>
                    <span className="font-medium">
                      {format(result.borrow_date, "MMM dd, yyyy")}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs">Due Date</span>
                    <span className="font-medium">
                      {format(result.due_date, "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="self-start">
                {dueDate(result.due_date) < 0 ? (
                  <div className="px-4 py-2  text-red-400 border-l-4 border-red-500 rounded">
                    <p className="font-semibold">
                      {Math.abs(dueDate(result.due_date))} days overdue
                    </p>
                  </div>
                ) : (
                  <div className="px-4 py-2 text-green-400 border-l-4 border-green-500 rounded">
                    <p className="font-semibold">
                      Due in {dueDate(result.due_date)} days
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-secondary/10 rounded-lg p-8 text-center">
          <p className="text-xl font-semibold"> 📚 No books checked out</p>
          <p className="text-muted-foreground mt-2">
            Your reading list is empty
          </p>
        </div>
      )}
    </div>
  );
}

export default Checkout;
