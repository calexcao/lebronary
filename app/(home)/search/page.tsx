import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

type Result = {
  id: number;
  author: string;
  name: string;
  category_links: {
    category_id: number;
    categories: {
      name: string;
    };
  }[];
  book_photos: { url: string }[];
};

async function SearchPage({
  searchParams,
}: {
  searchParams: { query: string; search_by: string };
}) {
  const params = await searchParams;
  const { query, search_by } = params;
  let results: Result[] = [];

  if (search_by === "title") {
    results = await prisma.books.findMany({
      where: {
        name: { contains: query },
      },
      include: {
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
    });
  } else if (search_by === "category") {
    results = await prisma.books.findMany({
      where: {
        category_links: {
          some: {
            categories: {
              name: { contains: query },
            },
          },
        },
      },
      include: {
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
    });
  }

  return (
    <div className="container mx-auto p-4 pt-10 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{`Search Results for "${query}"`}</h1>
        <p className="text-sm text-muted-foreground">
          {results.length} results found
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-6 gap-6">
          {results.map((result) => (
            <div
              key={result.id}
              className="group relative transition-transform duration-300 hover:scale-105"
            >
              <Link href={`/books/${result.id}`}>
                <div className="aspect-[2/3] relative overflow-hidden rounded-md">
                  <Image
                    src={result.book_photos[0]?.url}
                    alt={result.name}
                    fill
                    className="object-cover transition-all duration-300 group-hover:brightness-75"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <p className="font-medium truncate">{result.name}</p>
                    <p className="text-sm text-gray-300 truncate">
                      {result.author}
                    </p>
                    {result.category_links.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-xs bg-popover px-2 py-0.5 rounded-sm">
                          {result.category_links[0].categories.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-secondary/10 rounded-lg p-8 text-center">
          <p className="text-xl font-semibold">No results found</p>
          <p className="text-muted-foreground mt-2">
            Try a different search term
          </p>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
