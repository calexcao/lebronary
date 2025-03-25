import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

function SearchBar() {
  async function Search(formData: FormData) {
    "use server";
    const search_by = formData.get("search_by");
    const search = formData.get("search");

    console.log(search_by, search);
  }

  return (
    <form action={Search}>
      <div className="flex flex-row max-w-lg items-center space-x-2">
        <p className="text-sm min-w-[70px]">Search by</p>
        <Select name="search_by">
          <SelectTrigger className="w-full min-w-[110px]">
            <SelectValue placeholder="Keyword" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="category">Category</SelectItem>
          </SelectContent>
        </Select>
        <Input type="text" placeholder="Search..." name="search" />
        <Button type="submit">Search</Button>
      </div>
    </form>
  );
}

export default SearchBar;
