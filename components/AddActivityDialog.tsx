import { DialogDescription } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";
import { Activity } from "@/app/(admin)/admin/activities/Columns";
import { Textarea } from "./ui/textarea";
import DateSelect from "./DateSelect";
import TimeSelect from "./TimeSelect";
import ImageDropzone from "./ImageDropzone";
import { addActivity, editActivity } from "@/actions/action";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activity?: Activity;
};

const formSchema = z.object({
  activity_id: z.number().default(-1),
  title: z.string().nonempty(),
  description: z.string().min(10).max(255),
  date: z.date(),
  start_time: z.string(),
  end_time: z.string(),
  age_group: z.string(),
  capacity: z.coerce
    .number({ invalid_type_error: "must be a number" })
    .positive({ message: "Value must be positive" })
    .finite({ message: "Must be a valid number" }),
  photos: z.array(z.string()).default([]),
});

function AddAcitvityDialog({ setOpen, open, activity }: Props) {
  const path = usePathname();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      age_group: "",
      capacity: 0,
      photos: [],
    },
  });

  useEffect(() => {
    if (activity) {
      form.setValue("activity_id", activity.activity_id);
      form.setValue("title", activity.title);
      form.setValue("description", activity.description!);
      form.setValue("date", activity.date);
      form.setValue("start_time", activity.start_time);
      form.setValue("end_time", activity.end_time);
      form.setValue("age_group", activity.age_group!);
      form.setValue("capacity", activity.capacity!);
      form.setValue(
        "photos",
        activity.activity_photos?.map((p) => p.url) || []
      );
    }
  }, [activity, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (activity) {
        await editActivity({ ...values, path });
        setOpen(false);
      } else {
        await addActivity({ ...values, path });
      }
      toast("Activity Saved");
      form.reset();
    } catch (error) {
      console.error(error);
      toast("An error occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>List / Edit Activity</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-1">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Activity title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-1">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      maxLength={200}
                      placeholder="Provide a description of the actitivity"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-1">Date</FormLabel>
                  <FormControl>
                    <DateSelect field={field} disableDates={true} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-1">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-1">Start Time</FormLabel>
                    <FormControl>
                      <TimeSelect
                        onChange={field.onChange}
                        defaultValue={field.value}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-1">End Time</FormLabel>
                    <FormControl>
                      <TimeSelect
                        onChange={field.onChange}
                        defaultValue={field.value}
                        disableTime={form.getValues("start_time")}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-1">
              <FormField
                control={form.control}
                name="age_group"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-1">Age Group</FormLabel>
                    <FormControl>
                      <Input placeholder="12-17" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-1">Capacity</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 10" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="photos"
              render={({ field }) => <ImageDropzone photos={field.value} />}
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

export default AddAcitvityDialog;
