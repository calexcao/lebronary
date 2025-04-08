import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatISBN } from "@/lib/utils";
import Image from "next/image";
import CancelHoldButton from "./CancelHoldButton";

async function OnHold() {
  const session = await auth();
  const results = await prisma.reservations.findMany({
    where: {
      user_id: session?.user.id,
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

  const getRankUser = async (book_id: number) => {
    const rank = await prisma.$queryRaw`
      SELECT user_rank.queue_number 
      FROM (
          SELECT r.user_id,
                ROW_NUMBER() OVER (ORDER BY r.date) AS queue_number
          FROM reservations r
          WHERE book_id = ${book_id}
      ) AS user_rank
      WHERE user_rank.user_id = ${session?.user.id}
    `;

    return Array.isArray(rank) && rank.length > 0 ? rank[0].queue_number : 0;
  };

  return (
    <div className="mt-4">
      {results.length > 0 ? (
        <>
          {await Promise.all(
            results.map(async (result) => {
              const rank = await getRankUser(result.book_id);
              return (
                <div
                  key={result.book_id}
                  className="flex flex-row gap-6 p-6 border rounded-lg"
                >
                  <Image
                    className="rounded-md h-auto object-cover"
                    src={
                      result.books.book_photos[0]?.url ||
                      "/placeholder-book.jpg"
                    }
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
                  </div>

                  <div className="self-start">
                    <p className="font-bold text-green-400 p-2 border-l-4 border-green-500 rounded">
                      You are #{rank} in line
                    </p>
                    <CancelHoldButton
                      id={result.reservation_id}
                      styles="w-full mt-4"
                    />
                  </div>
                </div>
              );
            })
          )}
        </>
      ) : (
        <div className="bg-secondary/10 rounded-lg p-8 text-center">
          <p className="text-xl font-semibold"> ✋ No books on hold</p>
          <p className="text-muted-foreground mt-2">
            You have no books on hold. You can place a hold on any book in the
            library.
          </p>
        </div>
      )}
    </div>
  );
}

export default OnHold;
