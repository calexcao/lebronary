import { auth, signIn } from "@/auth";
import Checkout from "@/components/Checkout";
import Fines from "@/components/Fines";
import History from "@/components/History";
import OnHold from "@/components/OnHold";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

async function AccountPage() {
  const session = await auth();

  if (!session) signIn();

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      <Tabs defaultValue="checkout">
        <TabsList>
          <TabsTrigger value="checkout">Checked Out</TabsTrigger>
          <TabsTrigger value="onHold">On Hold</TabsTrigger>
          <TabsTrigger value="Fines">Fines</TabsTrigger>
          <TabsTrigger value="history">Borrowing History</TabsTrigger>
        </TabsList>
        <TabsContent value="checkout">
          <Checkout />
        </TabsContent>
        <TabsContent value="onHold">
          <OnHold />
        </TabsContent>
        <TabsContent value="Fines">
          <Fines />
        </TabsContent>
        <TabsContent value="history">
          <History />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AccountPage;
