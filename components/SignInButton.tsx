import { signIn } from "@/auth";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

function SignInButton({ styles }: { styles?: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn();
      }}
    >
      <Button type="submit" variant="ghost" className={cn(styles)}>
        Sign In
      </Button>
    </form>
  );
}

export default SignInButton;
