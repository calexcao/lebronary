import { Book } from "@/app/(admin)/admin/(catalog)/Columns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormDescription,
} from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { addBook, addPhoto, editBook, getCategories } from "@/actions/action";
import { toast } from "sonner";
import ImageDropzone from "./ImageDropzone";

type props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  book?: Book;
};

const formSchema = z.object({
  id: z.number().default(-1),
  name: z.string().nonempty(),
  isbn: z.string().min(10).max(13),
  author: z.string().nonempty(),
  publish_year: z.coerce
    .number({ invalid_type_error: "Must be a number" })
    .positive({ message: "Must be a positive number" })
    .finite({ message: "Must be a valud number" }),
  copies: z.coerce
    .number({ invalid_type_error: "Must be a number" })
    .positive({ message: "Must be a positive number" })
    .finite({ message: "Must be a valud number" }),
  category: z.array(z.number()).min(1, {
    message: "Must select at least one category",
  }),
  photos: z.array(z.string()),
});

function AddBookDialog({ open, setOpen, book }: props) {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const path = usePathname();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      isbn: "",
      author: "",
      publish_year: new Date().getFullYear(),
      copies: 1,
      category: [],
      photos: [],
    },
  });

  useEffect(() => {
    (async () => {
      const cats = await getCategories(0, -1);
      setCategories(cats.data);
    })();
  }, []);

  useEffect(() => {
    if (book) {
      form.setValue("id", book.id);
      form.setValue("name", book.name);
      form.setValue("isbn", book.isbn);
      form.setValue("copies", book.copies);
      form.setValue("publish_year", book.publish_year);
      form.setValue(
        "category",
        book.category_links?.map((c) => c.category_id) as number[]
      );
      form.setValue("photos", book.book_photos?.map((p) => p.url) || []);
      form.setValue("author", book.author);
    }
  }, [book, form]);

  const handleItemSelect = (item: number) => {
    const newValue = form.getValues("category").slice();
    const itemIndex = newValue.indexOf(item);
    if (itemIndex === -1) {
      newValue.push(item);
    } else {
      newValue.splice(itemIndex, 1);
    }
    form.setValue("category", newValue);
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (book) {
      await editBook({ ...values, path });
      setOpen(false);
    } else {
      await addBook({ ...values, path });
    }
    toast("Book Saved");
    form.reset();
  };

  const handleFileAdd = async (files: string[]) => {
    const existingPhotos = form.getValues("photos");
    form.setValue("photos", [...existingPhotos, ...files]);
  };

  const handleFileDelete = async (url: string) => {
    const updatedPhotos =
      form.getValues("photos").filter((p) => p !== url) ?? [];
    form.setValue("photos", updatedPhotos);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add / Edit Book</DialogTitle>
          <DialogDescription></DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Book name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Last First" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isbn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISBN</FormLabel>
                    <FormControl>
                      <Input placeholder="XXX-X-XX-XXXXXX-X" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="copies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel># of Copies</FormLabel>
                    <FormControl>
                      <Input placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="publish_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publish Year</FormLabel>
                    <FormControl>
                      <Input placeholder="2025" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Category</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value.length > 0
                              ? field.value
                                  .map(
                                    (val) =>
                                      categories.find((c) => c.id === val)?.name
                                  )
                                  .join(", ")
                              : "Select category"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search category..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {categories.map((category) => (
                                <CommandItem
                                  value={category.name}
                                  key={category.id}
                                  onSelect={() => {
                                    handleItemSelect(category.id);
                                  }}
                                >
                                  {category.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      field.value.includes(category.id)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select one or more categories for the book.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="photos"
                render={({ field }) => (
                  <ImageDropzone
                    photos={field.value}
                    onFilesAdded={handleFileAdd}
                    onFileDelete={handleFileDelete}
                  />
                )}
              />
              <div className="flex flex-col w-full">
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AddBookDialog;
