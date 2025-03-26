"use client"

import { DataTable } from "@/components/DataTable";
import { Category, columns } from "./Columns";

type props = {
  data: {
    id: number;
    name: string;
  }[];
  total: number;
};

function CategoriesTable({ data }: { data: props }) {
  const handleRowDelete = (item: Category) => {
    console.log(item);
  };

  const handleRowEdit = (item: Category) => {
    console.log(item);
  };
  return (
    <DataTable
      data={data.data}
      columns={columns}
      total={data.total}
      filterColumn="name"
      onRowDelete={handleRowDelete}
      onRowEdit={handleRowEdit}
    />
  );
}

export default CategoriesTable;
