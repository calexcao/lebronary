import { prisma } from "@/lib/prisma";
import FinesTable from "./FinesTable";

async function FinesPage({
  searchParams,
}: {
  searchParams: { page: string; limit: string };
}) {
  const params = await searchParams;
  const offset = parseInt(params.page || "10");
  const take = parseInt(params.limit || "10");

  const [fines, total] = await prisma.$transaction([
    prisma.fines.findMany({ skip: offset, take }),
    prisma.fines.count(),
  ]);

  return (
    <div className="flex flex-col">
      <FinesTable
        data={{ data: JSON.parse(JSON.stringify(fines)), total: total }}
      />
    </div>
  );
}

export default FinesPage;
