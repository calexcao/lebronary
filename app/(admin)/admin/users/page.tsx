import AddUserButton from "@/components/AddUserButton";
import { prisma } from "@/lib/prisma";
import UsersTable from "./UsersTable";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function UsersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const offset = parseInt((params.page as string) || "10");
  const take = parseInt((params.limit as string) || "10");

  const [users, total] = await prisma.$transaction([
    prisma.users.findMany({ skip: offset, take: take }),
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
