import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { SearchParams } from "@/lib/utils";
import { Metadata } from "@stripe/stripe-js";
import { CheckCircle2 } from "lucide-react";
import Stripe from "stripe";

async function FineResultPage(props: { searchParams: SearchParams }) {
  const params = await props.searchParams;
  const session_id = params.session_id;
  const session = await auth();

  console.log(params);

  if (!session_id) {
    throw new Error("Session ID is required");
  }

  if (!session) {
    throw new Error("Session not found");
  }

  const checkoutSession = await stripe.checkout.sessions.retrieve(
    session_id as string,
    {
      expand: ["payment_intent"],
    }
  );

  const payment_intent = checkoutSession.payment_intent as Stripe.PaymentIntent;
  const payment_status =
    payment_intent.status === "succeeded"
      ? "Payment Successful"
      : "Payment failed";

  if (payment_intent.status === "succeeded") {
    const metadata = checkoutSession.metadata as Metadata;
    const fine_id = metadata["fine_id"];

    await prisma.$transaction(
      async (t) =>
        await t.fines.update({
          where: {
            fine_id: +fine_id!,
          },
          data: {
            paid_date: new Date(),
          },
        })
    );
  }

  return (
    <div className="container mx-auto flex flex-col items-center pt-16">
      {payment_intent.status === "succeeded" ? (
        <>
          <CheckCircle2 size={64} className="text-green-500" />
          <p className="font-medium text-4xl py-4">Thank you!</p>
          <h1 className="mt-2 text-center font-bold tracking-tight text-2xl text-muted-foreground">
            Your fine has been paid.
          </h1>
        </>
      ) : (
        <p className="text-2xl text-red-500 border p-4 rounded-sm">
          {payment_status}
        </p>
      )}
    </div>
  );
}

export default FineResultPage;
