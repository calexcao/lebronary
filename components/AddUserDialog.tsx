import { User } from "@/app/(admin)/admin/users/Columns";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "./ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { cn } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { addUser, editUser } from "@/actions/action";
import { toast } from "sonner";
import { useEffect } from "react";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user?: User;
};

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().nonempty(),
  email: z.string().email(),
  card: z.string(),
  role: z.string(),
  is_active: z.boolean().default(true),
});

function AddUserDialog({ open, setOpen, user }: Props) {
  const path = usePathname();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      card: "",
      role: "member",
      is_active: true,
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue("name", user.name);
      form.setValue("email", user.email);
      form.setValue("role", user.role);
      form.setValue("card", user.card);
      form.setValue("is_active", user.is_active as boolean);
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (user) {
      await editUser(
        user.id,
        values.name,
        values.email,
        values.card,
        values.role,
        values.is_active,
        path
      );
    } else {
      await addUser(
        values.name,
        values.email,
        values.card,
        values.role,
        values.is_active,
        path
      );
    }

    toast("User Saved");
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manager Users</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-1">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Last" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-1">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@domain.com" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="card"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-1">Library Card No.</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 12345..." {...field} />
                  </FormControl>
                  <FormDescription className="text-sm text-muted-foreground">
                    Enter the 10 digit library card no.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-1">Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-auto">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                      }}
                    />
                  </FormControl>
                  <FormLabel
                    className={cn(
                      `${field.value ? "text-green-500" : "text-red-500"}`
                    )}
                  >
                    {field.value ? "Active" : "Inactive"}
                  </FormLabel>
                </FormItem>
              )}
            />

            <div className="flex flex-col w-full">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddUserDialog;
