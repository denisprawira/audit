import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import exportDocColDef from "@/features/audit/utils/column/ExportDocColDef";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  Download,
  LoaderCircle,
  SearchX,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Loader from "@/components/loader/Loader";
import EmptyPlaceholder from "@/components/empty-placeholder/EmptyPlaceholder";
import { useTransactionDocument } from "@/hooks/query/useTransactionDocument";
import { useFetchItemDocumentReport } from "@/hooks/query/useFetchItemDocumentReport";
import { useDocumentFiltersStore } from "@/features/audit/stores/filters/useDocumentFilterStore";
import toast from "react-hot-toast";
import { useUIStateStore } from "@/features/audit/stores/ui/useUIStore";

const ExportDataDialog = () => {
  const { open, setOpen } = useUIStateStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const { query } = useTransactionDocument(open);
  const { triggerDownload, query: exportQuery } = useFetchItemDocumentReport();
  const { filters } = useDocumentFiltersStore();
  const table = useReactTable({
    columns: exportDocColDef,
    data: query.data?.transaction ?? [],
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  useEffect(() => {
    if (query.error && open) {
      const errorMessage =
        query.error?.message ||
        "An error occurred while fetching transaction data.";
      toast.error(errorMessage);
    }

    if (exportQuery.error && open) {
      const errorMessage =
        exportQuery.error?.message ||
        "An error occurred while fetching the item document report.";
      toast.error(errorMessage);
    }
  }, [query.error, exportQuery.error]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="lg:min-w-[65%] sm:min-w-[90%] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle className="font-medium">{`Document #${filters?.docnum}`}</DialogTitle>
        </DialogHeader>
        <div className="max-sm:flex-col flex w-full sm:min-h-[300px] flex-row items-center gap-2 border rounded-sm border-muted-foreground/25 ">
          <div className="space-y-3 w-full sm:h-full sm:w-1/3 px-4 py-3 text-xs">
            <div className="flex justify-between">
              <p className="text-muted-foreground">{`Busproc`}</p>
              <p>
                {query.isLoading
                  ? "Loading..."
                  : (query.data?.detail.busproc ?? "-")}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground">{`Doc Date`}</p>
              <p>
                {query.isLoading
                  ? "Loading..."
                  : (query.data?.detail.doc_date ?? "-")}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground">{`Doc Num`}</p>
              <p>
                {query.isLoading
                  ? "Loading..."
                  : (query.data?.detail.doc_num ?? "-")}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground">{`Base Document`}</p>
              <p className="text-right">
                {query.isLoading
                  ? "Loading..."
                  : Array.isArray(query.data?.detail.base_doc)
                    ? query.data?.detail.base_doc.join(", ")
                    : (query.data?.detail.base_doc ?? "-")}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground">{`From`}</p>
              <p>
                {query.isLoading
                  ? "Loading..."
                  : (query.data?.detail.qty_from ?? "-")}
              </p>
            </div>
            <div className="flex justify-between ">
              <p className="text-muted-foreground">{`To`}</p>
              <p>
                {query.isLoading
                  ? "Loading..."
                  : (query.data?.detail.qty_to ?? "-")}
              </p>
            </div>
            <div className="flex flex-col gap-1 ">
              <p className="text-muted-foreground">{`Remark`}</p>
              <p>
                {query.isLoading
                  ? "Loading..."
                  : (query.data?.detail.remark ?? "-")}
              </p>
            </div>
          </div>
          <div
            className="w-full sm:w-1/3 flex flex-col flex-1 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent "
            style={{
              height: 400,
              maxHeight: 400,
            }}
          >
            <ShadcnTable
              loadingComponent={
                <div className="absolute inset-0 w-full h-full gap-2 flex justify-center items-center bg-gray-50 dark:bg-black/30 bg-opacity-75">
                  <Loader />
                </div>
              }
              isEmpty={
                query.data?.transaction.length === 0 || query.data === undefined
              }
              isLoading={query.isFetching || query.isLoading}
              emptyPlaceholder={
                <EmptyPlaceholder
                  icon={
                    <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-gray-600/20 flex justify-center items-center">
                      <SearchX />
                    </div>
                  }
                  title="No Result"
                  description="We don’t find what you’re looking for"
                />
              }
              slotProps={{
                container: {
                  className: cn(
                    "flex-1 border-t sm:border-t-0 sm:border-l  overflow-hidden ",
                    query.isLoading ? "overflow-hidden" : "overflow-auto",
                  ),
                },
              }}
            >
              <TableHeader className="sticky top-0 bg-background h-fit  ">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="h-fit  ">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          position: "relative",
                          width: header.getSize(),
                        }}
                        className={cn("px-4 py-2 h-4", "whitespace-nowrap")}
                      >
                        <div className="flex px-4 py-3 max-h-4   items-center gap-2 ">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}

                          {header.column.getCanSort() ? (
                            <span
                              className="cursor-pointer"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {{
                                asc: <ChevronUp className="size-4" />,
                                desc: <ChevronDown className="size-4" />,
                              }[header.column.getIsSorted() as string] ?? (
                                <ChevronsUpDown className="size-4" />
                              )}
                            </span>
                          ) : null}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="overflow-y-auto">
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id} className="py-2 max-h-6 ">
                          <div className="max-h-6 h-6 flex items-center px-4">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </ShadcnTable>
          </div>
        </div>
        <DialogFooter>
          <div className="flex justify-between w-full mt-2">
            <Button
              variant="ghost"
              className="bg-muted w-full"
              disabled={
                exportQuery.isFetching ||
                exportQuery.isLoading ||
                query.isFetching ||
                query.data?.transaction.length === 0 ||
                query.isError
              }
              onClick={() => {
                triggerDownload();
              }}
            >
              {exportQuery.isLoading || exportQuery.isFetching ? (
                <div className="flex gap-2 items-center">
                  <LoaderCircle className="animate-spin size-4" />
                  Loading...
                </div>
              ) : (
                <>
                  <Download />
                  Export to Excel
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDataDialog;
