import { auth, signIn } from "@/auth";
import BackButton from "@/components/BackButton";
import SignOutButton from "@/components/SignOutButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/prisma";
import ProfileForm from "./ProfileForm";

async function ProfilePage() {
  const session = await auth();

  if (!session) {
    await signIn();
  }

  const user = await prisma.users.findUnique({
    where: {
      id: session?.user.id,
    },
  });

  return (
    <div className="container mx-auto mt-32 max-w-md border rounded-md shadow-md p-8 space-y-2">
      <BackButton styles="-ml-3" />
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p>
        Hello, <span className="font-bold">{session?.user.name}</span>
      </p>
      {session?.user.status === "pending" && (
        <p className="border border-red-300 rounded-md p-2 bg-red-100 text-red-700">
          You must update your password and re-login
        </p>
      )}
      {!session?.user.is_active && (
        <p className="border border-red-300 rounded-md p-2 bg-red-100 text-red-700">
          Your account has been deactivated
        </p>
      )}
      <div>
        <Label className="mb-2">Name</Label>
        <Input
          readOnly
          type="text"
          className="mb-4"
          defaultValue={session?.user.name as string}
        />
      </div>

      <div>
        <Label className="mb-2">Email</Label>
        <Input
          readOnly
          type="text"
          className="mb-4"
          defaultValue={session?.user.email as string}
        />
      </div>

      {session?.user.role === "member" && (
        <div>
          <Label className="mb-2">Library Card No.</Label>
          <Input
            readOnly
            type="text"
            className="mb-2"
            defaultValue={user?.card as string}
          />
        </div>
      )}
      {session?.user.role === "staff" && <ProfileForm />}
      <SignOutButton styles="w-full border mt-2" />
    </div>
  );
}

export default ProfilePage;
