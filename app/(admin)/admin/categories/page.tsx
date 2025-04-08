import AddCategoryButton from "@/components/AddCategoryButton";
import { prisma } from "@/lib/prisma";
import CategoriesTable from "./CategoriesTable";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function CategoriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const offset = parseInt((params.page as string) || "10");
  const take = parseInt((params.limit as string) || "10");

  const [categories, total] = await prisma.$transaction([
    prisma.categories.findMany({ skip: offset, take: take }),
    prisma.categories.count(),
  ]);

  return (
    <div className="flex flex-col">
      <AddCategoryButton />
      <CategoriesTable data={{ data: categories, total }} />
    </div>
  );
}

export default CategoriesPage;
