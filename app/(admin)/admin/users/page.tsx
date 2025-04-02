import AddUserButton from "@/components/AddUserButton";
import { prisma } from "@/lib/prisma";
import UsersTable from "./UsersTable";

async function UsersPage({
  searchParams,
}: {
  searchParams: { page: string; limit: string };
}) {
  const params = await searchParams;
  const offset = parseInt(params.page || "10");
  const take = parseInt(params.limit || "10");

  const [users, total] = await prisma.$transaction([
    prisma.users.findMany({ skip: offset, take }),
    prisma.users.count(),
  ]);

  return (
    <div className="flex flex-col">
      <AddUserButton />
      <UsersTable data={{ data: users, total: total }} />
    </div>
  );
}

export default UsersPage;
