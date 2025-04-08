import Logo from "@/components/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center border rounded-md p-8">
        <p className="-ml-4">
          <Logo />
        </p>
        {children}
      </div>
    </div>
  );
}
