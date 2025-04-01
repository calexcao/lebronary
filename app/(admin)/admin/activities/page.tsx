import AddActivityButton from "@/components/AddActitivityButton";
import { prisma } from "@/lib/prisma";
import ActivitiesTable from "./ActivitiesTable";

async function ActivitiesPage({
  searchParams,
}: {
  searchParams: { page: string; limit: string };
}) {
  const params = await searchParams;
  const offset = parseInt(params.page || "10");
  const take = parseInt(params.limit || "10");

  const [activities, total] = await prisma.$transaction([
    prisma.activities.findMany({ skip: offset, take }),
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
