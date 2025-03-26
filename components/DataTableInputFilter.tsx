import { Table } from "@tanstack/react-table";
import { Input } from "./ui/input";

interface DataTableInputFilterProps<TData> {
  column: string;
  table: Table<TData>;
}

function DataTableInputFilter<TData>({
  column,
  table,
}: DataTableInputFilterProps<TData>) {
  return (
    <Input
      placeholder="Filter..."
      value={(table.getColumn(column)?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn(column)?.setFilterValue(event.target.value)
      }
      className="max-w-sm"
    />
  );
}

export default DataTableInputFilter;
