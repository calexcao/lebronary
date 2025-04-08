import AddActivityButton from "@/components/AddActivityButton";
import { prisma } from "@/lib/prisma";
import ActivitiesTable from "./ActivitiesTable";
import { SearchParams } from "@/lib/utils";

async function ActivitiesPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const offset = parseInt((searchParams.offset as string) || "0", 10);
  const take = parseInt((searchParams.take as string) || "10", 10);

  const [activities, total] = await prisma.$transaction([
    prisma.activities.findMany({ skip: offset, take: take }),
    prisma.activities.count(),
  ]);

  return (
    <div className="flex flex-col">
      <AddActivityButton />
      <ActivitiesTable data={{ data: activities, total }} />
    </div>
  );
}

export default ActivitiesPage;
