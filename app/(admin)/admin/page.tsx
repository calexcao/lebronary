import AddBookButton from "@/components/AddBookButton";
import CatalogTable from "./(catalog)/CatalogTable";
import { prisma } from "@/lib/prisma";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const offset = parseInt((params.page as string) || "10");
  const take = parseInt((params.limit as string) || "10");

  const [books, total] = await prisma.$transaction([
    prisma.books.findMany({
      skip: offset,
      take: take,
      select: {
        id: true,
        name: true,
        copies: true,
        isbn: true,
        is_active: true,
        publish_year: true,
        author: true,
        book_photos: {
          select: {
            photo_id: true,
            url: true,
          },
        },
        category_links: {
          select: {
            category_id: true,
          },
        },
      },
    }),
    prisma.books.count(),
  ]);

  return (
    <div>
      <AddBookButton />
      <CatalogTable data={{ data: books, total: total }} />
    </div>
  );
}

export default AdminPage;
