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

  return (
    <div className="container mx-auto mt-10 flex flex-col justify-center space-y-6">
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
                <p className="truncate font-semibold text-lg">{book.name}</p>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <h2 className="text-2xl font-bold">Recently Reviewed</h2>
      <h2 className="text-2xl font-bold">Staff Picks</h2>
    </div>
  );
}
