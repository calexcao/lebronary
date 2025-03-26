import AddCategoryButton from "@/components/AddCategoryButton";
import { prisma } from "@/lib/prisma";
import CategoriesTable from "./CategoriesTable";

async function CategoriesPage({
  searchParams,
}: {
  searchParams: { page: string; limit: string };
}) {
  const params = await searchParams;
  const offset = parseInt(params.page || "10");
  const take = parseInt(params.limit || "10");

  const [categories, total] = await prisma.$transaction([
    prisma.categories.findMany({ skip: offset, take }),
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
