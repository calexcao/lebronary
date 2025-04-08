import { auth, signIn } from "@/auth";

async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) await signIn();

  return <div className="container mx-auto pb-10">{children}</div>;
}

export default AccountLayout;
