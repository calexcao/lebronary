"use client";

import { State, updateProfile } from "@/actions/action";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const passwordSchema = z.object({
  old_password: z.string(),
  new_password: z.string().min(8),
});

function ProfileForm() {
  const initialState: State = { message: null };
  const [state, formAction] = useActionState(updateProfile, initialState);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
    },
  });

  return (
    <>
      <Form {...form}>
        <form action={formAction} className="space-y-4">
          <FormField
            control={form.control}
            name="old_password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Old Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter old password"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/5"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/5"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </FormItem>
            )}
          />
          <p className="text-red-400">{state.message}</p>
          <Button type="submit" className="w-full">
            Update
          </Button>
        </form>
      </Form>
    </>
  );
}

export default ProfileForm;
