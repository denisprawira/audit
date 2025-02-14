import { useDocumentFiltersStore } from "@/features/audit/stores/filters/useDocumentFilterStore";
import { useUIStateStore } from "@/features/audit/stores/ui/useUIStore";
import { IItemTransactionData } from "@/features/audit/types/data/TransactionTypes";
import { isExcelFormat } from "@/utils/string-helpers";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import format from "dayjs/plugin/customParseFormat";

dayjs.extend(format);

export const useDetailColdefStore = (
  db: string,
): ColumnDef<IItemTransactionData>[] => {
  const { setOpen } = useUIStateStore();
  const { setFilters } = useDocumentFiltersStore();

  const handleClickRow = (busproc: string, docnum: string) => {
    setOpen(true);
    setFilters({
      busproc,
      db,
      docnum,
    });
  };

  return [
    {
      accessorKey: "busproc",
      header: "Busproc",
      size: 78,
      cell: ({ row }) => {
        const value: string = row.getValue("busproc") as string;
        return <div className="">{value || "-"}</div>;
      },
    },
    {
      accessorKey: "doc_num",
      header: "# Doc",
      size: 100,
      cell: ({ getValue, row }) => {
        const value: string = getValue() as string;
        const date: string = row.original.doc_date
          ? dayjs(row.original.doc_date, "YYYY-MM-DD").format("DD/MM/YY")
          : "-";
        return (
          <div className="space-y-2">
            <div
              className={`${value && value !== "-" && !isExcelFormat(value) ? `underline cursor-pointer` : ``}`}
              onClick={() => {
                value &&
                  value !== "-" &&
                  !isExcelFormat(value) &&
                  handleClickRow(row.original.busproc, value);
              }}
            >
              {value || "-"}
            </div>
            <div className="w-fit whitespace-nowrap text-sm text-slate-700 dark:text-slate-400">
              {date || "-"}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "from",
      header: "From",
      size: 111,
      cell: (info) => {
        const value: string = info.getValue() as string;
        return <div className="">{value || "-"}</div>;
      },
    },
    {
      accessorKey: "to",
      header: "To",
      size: 111,
      cell: (info) => {
        const value: string = info.getValue() as string;
        return <div className="">{value || "-"}</div>;
      },
    },
    {
      accessorKey: "qty",
      header: "Qty",
      size: 111,
      cell: (info) => {
        const value: string = info.getValue() as string;
        return <div className="">{value.toLocaleString() ?? "-"}</div>;
      },
    },
    {
      accessorKey: "cumulative_qty",
      header: "Accumulation",
      size: 111,

      cell: (info) => {
        const value: string = info.getValue() as string;
        return <div className="">{value.toLocaleString() ?? "-"}</div>;
      },
    },
    {
      accessorKey: "base_doc",
      header: "Base Doc",
      size: 120,
      cell: (info) => {
        const value: string = info.getValue() as string;
        return (
          <div
            className={`${value && value !== "-" && !isExcelFormat(value) ? `underline cursor-pointer` : ``}`}
            onClick={() => {
              value &&
                value !== "-" &&
                !isExcelFormat(value) &&
                handleClickRow(info.row.original.busproc, value);
            }}
          >
            {value || "-"}
          </div>
        );
      },
    },
  ];
};
