import { IDocumentTransaction } from "@/features/audit/types/data/PreviewDocumentTypes";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import format from "dayjs/plugin/customParseFormat";

dayjs.extend(format);

const exportDocColDef: ColumnDef<IDocumentTransaction>[] = [
  {
    accessorKey: "no",
    header: "No",
    size: 40,
    cell: ({ table, row }) => {
      const rowIndex = table
        .getSortedRowModel()
        .flatRows.findIndex((r) => r.id === row.id);
      return <div>{rowIndex + 1}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "itemcode",
    header: "Item Code",
    size: 100,
    cell: (info) => {
      const value: string = info.getValue() as string;
      return <div className="">{value ?? "-"}</div>;
    },
  },
  {
    accessorKey: "qty_total",
    header: "Qty",
    size: 40,
    cell: (info) => {
      const value: number = info.getValue() as number;
      return <div className="">{value ?? "-"}</div>;
    },
  },
];
export default exportDocColDef;
