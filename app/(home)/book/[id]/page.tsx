import { auth } from "@/auth";
import AddToStaffPickButton from "@/components/AddToStaffPickButton";
import BackButton from "@/components/BackButton";
import CancelHoldButton from "@/components/CancelHoldButton";
import CommentBox from "@/components/CommentBox";
import CommentCard from "@/components/CommentCard";
import PlaceHoldButton from "@/components/PlaceHoldButton";
import Rating from "@/components/Rating";
import RemoveFromStaffPicksButton from "@/components/RemoveFromStaffPicksButton";
import SignInButton from "@/components/SignInButton";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { formatISBN, SearchParams } from "@/lib/utils";
import { BookOpen, ScanBarcode } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

async function BookPage(props: { params: SearchParams }) {
  const session = await auth();
  const p = await props.params;
  const id = parseInt(p.id as string, 10);
  const [book_details, stats, reservation_count, reservation] =
    await prisma.$transaction([
      prisma.books.findUnique({
        where: { id: id },
        include: {
          staff_picks: {
            where: {
              book_id: id,
              user_id: session?.user.id,
            },
            select: {
              pick_id: true,
            },
          },
          ratings: {
            select: {
              rating: true,
            },
          },
          book_photos: {
            select: { url: true },
          },
          category_links: {
            include: {
              categories: {
                select: { name: true },
              },
            },
          },
        },
      }),
      prisma.ratings.aggregate({
        _avg: { rating: true },
        _count: { rating: true },
        where: { book_id: id },
      }),
      prisma.reservations.count({
        where: { book_id: id },
      }),
      prisma.reservations.findFirst({
        where: {
          book_id: id,
          user_id: session?.user.id,
        },
        select: { reservation_id: true },
      }),
    ]);

  const copiesAvailable = () => {
    if (book_details?.copies) {
      const copies = book_details.copies - reservation_count;
      return copies > 0 ? copies : 0;
    }
  };

  // console.log(session?.user);
  // console.log(stats._avg.rating);

  return (
    <div className="container mx-auto">
      <BackButton styles="hover:text-primary text-muted-foreground" />
      <div className="flex flex-row p-4 pt-10 space-y-8">
        <Image
          className="rounded-md h-auto"
          src={book_details?.book_photos[0].url as string}
          alt="book"
          width={300}
          height={0}
        />
        <div className="flex-grow ml-5">
          <h1 className="font-bold text-2xl">{book_details?.name}</h1>
          <p className="text-muted-foreground">{book_details?.author}</p>
          <div className="flex flex-row items-center space-x-2 py-4">
            <Rating rating={stats._avg.rating!} />
            <p className="text-muted-foreground text-sm">
              {stats._count.rating} reviews
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex px-4 py-2 text-green-700 border border-green-500 rounded-md">
              <BookOpen className="mr-2" /> {book_details?.publish_year}
            </div>
            {book_details?.category_links &&
              book_details.category_links.map((cl) => (
                <div
                  key={cl.category_id}
                  className="flex px-4 py-2 text-sm text-muted-foreground border border-muted-foreground rounded-md"
                >
                  {cl.categories.name}{" "}
                </div>
              ))}
          </div>
          <p className="max-w-230 text-muted-foreground py-4">
            {book_details?.description}
          </p>
          <p className="flex flex-row items-center text-muted-foreground text-sm">
            <ScanBarcode className="mr-2" />{" "}
            {formatISBN(book_details?.isbn as string)}
          </p>
        </div>
        <div className="flex flex-col space-y-2 mt-4 flex-grow max-w-[180px]">
          <div className=" text-primary flex flex-col p-2 border-l-4 border-green-500">
            <p className="text-green-400 font-medium pb-2">Availability</p>
            <p className="text-sm flex flex-col">
              <span>{book_details?.copies} copies</span>
              <span>{copiesAvailable()} available</span>
              <span>{reservation_count} on hold</span>
            </p>
          </div>
          {book_details?.id &&
            (session?.user ? (
              reservation?.reservation_id ? (
                <CancelHoldButton id={reservation.reservation_id} />
              ) : (
                <PlaceHoldButton id={book_details.id} />
              )
            ) : (
              <SignInButton styles={"w-full border"} />
            ))}
          {book_details?.id &&
            session?.user.role === "staff" &&
            (book_details.staff_picks && book_details.staff_picks.length > 0 ? (
              <RemoveFromStaffPicksButton
                id={book_details.staff_picks[0].pick_id}
              />
            ) : (
              <AddToStaffPickButton id={book_details.id} />
            ))}
        </div>
      </div>
      <Separator className="mb-4" />
      {book_details?.id &&
        (session?.user ? (
          <CommentBox id={book_details.id} />
        ) : (
          <p className="font-bold border rounded-sm p-4">
            <Link
              href={`/auth/signin?callbackUrl=/book/${book_details?.id}`}
              className="text-blue-400"
            >
              Sign In
            </Link>{" "}
            to leave a comment
          </p>
        ))}
      {book_details?.id && <CommentCard id={book_details?.id} />}
    </div>
  );
}

export default BookPage;
