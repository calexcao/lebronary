import AddBookButton from "@/components/AddBookButton";
import CatalogTable from "./(catalog)/CatalogTable";
import { prisma } from "@/lib/prisma";

async function AdminPage({
  searchParams,
}: {
  searchParams: { page: string; limit: string };
}) {
  const params = await searchParams;
  const offset = parseInt(params.page || "10");
  const take = parseInt(params.limit || "10");

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
      <CatalogTable />
    </div>
  );
}

export default AdminPage;
