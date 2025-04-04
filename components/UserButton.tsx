import { auth } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown, User2 } from "lucide-react";
import Link from "next/link";
import SignInButton from "./SignInButton";
import SignOutButton from "./SignOutButton";

async function UserButton() {
  const session = await auth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex space-x-1 items-center text-muted-foreground hover:text-primary">
          <User2 size={16} />
          <p className="text-sm">{session?.user.name}</p>
          <ChevronDown size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        className="w-[180px] p-2 bg-background text-muted-foreground"
      >
        {!session ? (
          <DropdownMenuItem>
            <div className="flex justify-center w-full">
              <SignInButton />
            </div>
          </DropdownMenuItem>
        ) : (
          <>
            {session.user.role === "staff" && (
              <>
                <DropdownMenuItem className="">
                  <Link href="/admin">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/account">My Account</Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/">Home</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex justify-center w-full">
                <SignOutButton />
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserButton;
