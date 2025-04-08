"use client";

import { checkin, checkout, State } from "@/actions/action";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import React, { useActionState } from "react";

function KioskPage() {
  const initialState: State = { message: null };
  const [stateCheckout, formActionCheckout] = useActionState(
    checkout,
    initialState
  );
  const [stateCheckin, formActionCheckin] = useActionState(
    checkin,
    initialState
  );

  return (
    <div className="container mx-auto mt-32 max-w-md border rounded-md shadow-md p-8 space-y-2">
      <form action={formActionCheckout}>
        <div className="p-8 space-y-2">
          <BackButton styles="-ml-3" />
          <h1 className="text-2xl font-bold mb-4 text-center">Virtual Kiosk</h1>
          <div>
            <Label htmlFor="card" className="mb-2">
              Library Card No.
            </Label>
            <Input name="card" id="card" type="text" className="mb-4" />
          </div>
          <div>
            <Label htmlFor="isbn" className="mb-2">
              ISBN #
            </Label>
            <Input name="isbn" id="isbn" type="text" className="mb-4" />
          </div>
          <Button type="submit" className="w-full">
            Check Out
          </Button>
        </div>
        {stateCheckout.message && (
          <p className="text-center border border-dashed rounded-md p-2 mb-8">
            {stateCheckout.message}
          </p>
        )}
      </form>
      <Separator />
      <form action={formActionCheckin}>
        <div className="p-8 space-y-2">
          <div>
            <Label htmlFor="isbn" className="mb-2">
              ISBN #
            </Label>
            <Input name="isbn" id="isbn" type="text" className="mb-4" />
          </div>
          <Button type="submit" className="w-full">
            Check In
          </Button>
        </div>
        {stateCheckin.message && (
          <p className="text-center border border-dashed rounded-md p-2">
            {stateCheckin.message}
          </p>
        )}
      </form>
    </div>
  );
}

export default KioskPage;
