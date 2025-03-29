"use client";

import { DataTable } from "@/components/DataTable";
import { Book, columns } from "./Columns";

type props = {
  data: Book[];
  total: number;
};

function CatalogTable({ data }: { data: props }) {
  const handleRowDelete = (item: Book) => {
    console.log(item);
  };

  const handleRowEdit = (item: Book) => {
    console.log(item);
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={data.data}
        total={data.total}
        filterColumn="name"
        onRowDelete={handleRowDelete}
        onRowEdit={handleRowEdit}
      />
    </>
  );
}

export default CatalogTable;
