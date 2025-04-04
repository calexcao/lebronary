import { signOut } from "@/auth";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

function SignOutButton({ styles }: { styles?: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button type="submit" variant="ghost" className={cn(styles)}>
        Sign Out
      </Button>
    </form>
  );
}

export default SignOutButton;
