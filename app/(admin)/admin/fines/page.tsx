import { prisma } from "@/lib/prisma";
import FinesTable from "./FinesTable";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function FinesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const offset = parseInt((params.page as string) || "10");
  const take = parseInt((params.limit as string) || "10");
  const [fines, total] = await prisma.$transaction([
    prisma.fines.findMany({
      skip: offset,
      take: take,
      select: {
        fine_id: true,
        amount: true,
        fine_date: true,
        paid_date: true,
        users: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.fines.count(),
  ]);

  return (
    <div className="flex flex-col mt-9">
      <FinesTable
        data={{ data: JSON.parse(JSON.stringify(fines)), total: total }}
      />
    </div>
  );
}

export default FinesPage;
