import { auth, signIn } from "@/auth";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchParams } from "@/lib/utils";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

const SIGNIN_ERROR_URL = "/auth/signin/error?error=";

async function SignInPage(props: { searchParams: SearchParams }) {
  const params = await props.searchParams;
  const session = await auth();

  if (session?.user) {
    redirect((params.callbackUrl as string) || "/");
  }

  async function handleSignIn(formData: FormData) {
    "use server";
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      });

      if (result?.error) {
        redirect(
          `${SIGNIN_ERROR_URL}${encodeURIComponent(
            "Invalid credentials"
          )}&callbackUrl=${encodeURIComponent(params.callbackUrl as string)}`
        );
      }

      redirect((params.callbackUrl as string) || "/");
    } catch (error) {
      console.log(error);
      if (error instanceof AuthError) {
        redirect(
          `${SIGNIN_ERROR_URL}${encodeURIComponent(
            "Invalid credentials"
          )}&callbackUrl=${encodeURIComponent(params.callbackUrl as string)}`
        );
      }
      throw error;
    }
  }

  return (
    <form action={handleSignIn} className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input name="email" type="email" id="email" placeholder="Email" />
      <Label htmlFor="password">Password</Label>
      <Input
        name="password"
        type="password"
        id="password"
        placeholder="Password"
      />
      <p className="text-sm text-muted-foreground">
        If you are a member, use your 10 digit library card no.
      </p>
      <Button type="submit" className="w-full">
        Sign In
      </Button>
      <BackButton />
    </form>
  );
}

export default SignInPage;
