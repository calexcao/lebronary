import Rating from "@/components/Rating";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function HomePage() {
  const arrivals = await prisma.books.findMany({
    skip: 0,
    take: 10,
    include: {
      book_photos: {
        select: { url: true },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const recently_reviewed = await prisma.ratings.findMany({
    skip: 0,
    take: 10,
    distinct: ["book_id"],
    include: {
      books: {
        include: {
          book_photos: { select: { url: true } },
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const staff_picks = await prisma.staff_picks.findMany({
    skip: 0,
    take: 10,
    include: {
      books: {
        include: {
          book_photos: { select: { url: true } },
        },
      },
      users: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <div className="container mx-auto mt-10 flex flex-col justify-center space-y-6 mb-8">
      <h2 className="text-2xl font-bold">New Arrivals</h2>
      <Carousel
        opts={{ slidesToScroll: "auto", align: "start" }}
        className="flex w-full min-w-xl"
      >
        <CarouselContent>
          {arrivals.map((book) => (
            <CarouselItem key={book.id} className="basis-auto">
              <Link href={`/book/${book.id}`}>
                <div className="w-[300px] h-[450px] relative">
                  <Image
                    src={book.book_photos[0]?.url}
                    alt={book.name}
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <p className="w-[300px] truncate font-semibold text-lg">
                  {book.name}
                </p>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <h2 className="text-2xl font-bold">Recently Reviewed</h2>
      <Carousel
        opts={{ slidesToScroll: "auto", align: "start" }}
        className="flex w-full min-w-xl"
      >
        <CarouselContent>
          {recently_reviewed.map((book) => (
            <CarouselItem key={book.book_id} className="basis-auto">
              <Link href={`/book/${book.book_id}`}>
                <div className="w-[300px] h-[450px] relative">
                  <Image
                    src={book.books.book_photos[0]?.url}
                    alt={book.books.name}
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="mt-2">
                  <Rating rating={book.rating} />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <h2 className="text-2xl font-bold">Staff Picks</h2>
      <Carousel
        opts={{ slidesToScroll: "auto", align: "start" }}
        className="flex w-full min-w-xl"
      >
        <CarouselContent>
          {staff_picks.map((book) => (
            <CarouselItem key={book.book_id} className="basis-auto">
              <Link href={`/book/${book.book_id}`}>
                <div className="w-[300px] h-[450px] relative">
                  <Image
                    src={book.books.book_photos[0]?.url}
                    alt={book.books.name}
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="font-semibold text-lg">
                  By {book.users.name}
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
