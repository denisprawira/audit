import { useColdefStore } from "@/features/audit/utils/column/ColDef";
import {
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  SearchX,
  Table2,
} from "lucide-react";
import { cn } from "@/lib/utils";
// import Pagination from "@/features/store/components/pagination/Pagination";
import { useWarehouseOverviewFilters } from "@/features/audit/stores/filters/useWarehouseOverviewFiltersStore";
import EmptyPlaceholder from "@/components/empty-placeholder/EmptyPlaceholder";
import Loader from "@/components/loader/Loader";
import { useFetchWarehousesOverview } from "@/hooks/query/useWarehouseOverviewQueries";
import {
  Filter,
  IWarehouseQueryParams,
} from "@/features/audit/types/filters/WarehouseOverviewFilters";
import { useTheme } from "@/components/theme-provider/ThemeProvider";
import toast from "react-hot-toast";
import { useUIStateStore } from "@/features/audit/stores/ui/useUIStore";

const Table = () => {
  const colDef = useColdefStore();
  const [sorting, setSorting] = useState<SortingState>([]);

  const { queryParams, company, setSorts } = useWarehouseOverviewFilters();
  const {
    setHideSubmit,
    setOverviewFetchingStatus,
    resetOverviewSort,
    setResetOverviewSort,
    setIsAllFinalized,
  } = useUIStateStore();

  const {
    setIsFinalizeActive,
    allowFinalize,
    setAllowFinalize,
    setShowBottomFilters,
  } = useUIStateStore();
  const { theme } = useTheme();

  const {
    data: warehouseOverviewData,
    isLoading,
    isFetching,
    isRefetching,
    error,
    status,
  } = useFetchWarehousesOverview(
    company,
    queryParams || ({} as IWarehouseQueryParams),
  );

  useEffect(() => {
    setOverviewFetchingStatus(isFetching);
    const shouldHideSubmit =
      (status === "success" && !isFetching) || isRefetching;
    setHideSubmit(shouldHideSubmit);
  }, [isFetching, status, warehouseOverviewData]);

  useEffect(() => {
    if (warehouseOverviewData?.data && warehouseOverviewData?.data.length > 0) {
      // Check if there's any item where is_finalized is false
      const isFinalized = warehouseOverviewData.data.find((item) => {
        return item.is_finalized === false;
      });
      isFinalized ? setIsAllFinalized(false) : setIsAllFinalized(true);
    } else {
      setIsAllFinalized(false);
    }
    const isWarehouseDataEmpty = !warehouseOverviewData?.data.length;
    const hasFiltersExceptBrandCode = queryParams.filters?.some(
      (filter: Filter) => filter.field !== "brand_code",
    );
    const isSortsEmpty = !Object.keys(queryParams?.sorts ?? {}).length;
    const isSearchEmpty = !queryParams.search?.length;

    const filtersEmpty =
      isSortsEmpty && isSearchEmpty && !hasFiltersExceptBrandCode;

    const showBottomFilters =
      ((status === "pending" || status === "success") &&
        !isWarehouseDataEmpty) ||
      !filtersEmpty;
    setShowBottomFilters(showBottomFilters);
  }, [status, warehouseOverviewData, queryParams, isFetching]);

  useEffect(() => {
    if (error) {
      delete queryParams.sorts;
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (resetOverviewSort) {
      setSorting([]);
      setResetOverviewSort(false);
    }
  }, [resetOverviewSort]);

  useEffect(() => {
    if (warehouseOverviewData?.data?.length === 0) {
      delete queryParams.sorts;
    }
    setAllowFinalize(warehouseOverviewData?.allow_finalize ?? false);
  }, [warehouseOverviewData, queryParams, setAllowFinalize]);

  useEffect(() => {
    const sorts = sorting.length
      ? {
          [sorting[0].id === "review" ? "is_reviewed" : sorting[0].id]:
            sorting[0].desc ? "desc" : "asc",
        }
      : {};
    setSorts(sorts);
  }, [sorting, setSorts]);

  useEffect(() => {
    const isEmptyArray =
      !warehouseOverviewData?.data || warehouseOverviewData.data.length === 0;
    const finalizeActive = !isEmptyArray && allowFinalize;
    setIsFinalizeActive(finalizeActive);
  }, [warehouseOverviewData?.data, allowFinalize, setIsFinalizeActive]);

  const tableData = useMemo(
    () => warehouseOverviewData?.data ?? [],
    [warehouseOverviewData?.data],
  );

  const table = useReactTable({
    columns: colDef,
    data: tableData,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    state: { sorting },
    onSortingChange: setSorting,
    defaultColumn: {
      size: 200,
      minSize: 50,
      maxSize: 500,
    },
    manualPagination: true,
  });

  return (
    <>
      <ShadcnTable
        loadingComponent={
          <div className="absolute inset-0 w-full h-full gap-2 flex justify-center items-center bg-gray-50 dark:bg-black/30 bg-opacity-75">
            <Loader />
          </div>
        }
        isEmpty={
          warehouseOverviewData?.data.length === 0 ||
          warehouseOverviewData === undefined
        }
        isLoading={isFetching || isLoading}
        emptyPlaceholder={
          (queryParams.search && queryParams.search?.length > 0) ||
          (queryParams.filters && queryParams.filters?.length > 0) ? (
            <EmptyPlaceholder
              icon={
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-gray-600/20 flex justify-center items-center ">
                  <SearchX />
                </div>
              }
              title="No Result"
              description="We don’t find what you’re looking for"
            />
          ) : (
            <EmptyPlaceholder
              icon={
                <div
                  className={`w-20 h-20 rounded-full bg-slate-100 dark:bg-gray-600/20 flex justify-center items-center ${status === "success" && `bg-green-100 dark:bg-green-200`}`}
                >
                  {status === "pending" ? (
                    <Table2 />
                  ) : (
                    <Check className="text-green-700" />
                  )}
                </div>
              }
              title={
                status === "pending" ? "Submit to Show data" : "All data match"
              }
              description={
                status === "pending"
                  ? "Data will show up here"
                  : "There’s no difference in item code stock"
              }
            />
          )
        }
        slotProps={{
          container: {
            className: cn(
              "flex-1 rounded-md  rounded-b-none border rounded-lg  overflow-hidden max-sm:min-h-40",
              isLoading ? "overflow-hidden" : "overflow-auto",
            ),
          },
        }}
        footer={
          <div
            style={{
              minWidth: table.getFlatHeaders().reduce((total, header) => {
                return total + header.getSize();
              }, 0),
            }}
            className="sticky bottom-0 border-t  w-full bg-background"
          >
            {table.getRowModel().rows.length !== 0 && (
              <div className="flex w-fit">
                {(() => {
                  // Calculate totals once, before rendering headers
                  const totals = table.getRowModel().rows.reduce(
                    (acc, row) => {
                      (acc.qtyDifference += row.original.qty_difference || 0),
                        (acc.qtySoh += row.original.qty_soh || 0);
                      acc.qtySoh1 += row.original.qty_soh_1 || 0;
                      return acc;
                    },
                    { qtyDifference: 0, qtySoh: 0, qtySoh1: 0 },
                  );

                  return table.getFlatHeaders().map((header, index) => {
                    const columnWidth = header.getSize();
                    const getColumnData: { [key: string]: number | string } = {
                      qty_soh_1: totals.qtySoh1,
                      qty_soh: totals.qtySoh,
                      itemcode: "Total",
                      qty_difference: totals.qtyDifference,
                    };

                    const columnData =
                      getColumnData[header.id as keyof typeof getColumnData];

                    return (
                      <div
                        key={index}
                        className="max-h-12 h-12 flex items-center px-8 py-4"
                        style={{
                          justifyContent: [
                            "remark",
                            "itemcode",
                            "brand_code",
                          ].includes(header.id)
                            ? "start"
                            : "end",
                          minWidth: `${columnWidth}px`,
                        }}
                      >
                        {columnData}
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </div>
        }
      >
        <TableHeader className="sticky top-0 bg-background h-fit  ">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="h-fit  ">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{ position: "relative", width: header.getSize() }}
                  className={cn("px-4 py-2 h-4", "whitespace-nowrap")}
                >
                  <div
                    className={`flex px-4 py-3 max-h-4 items-center gap-2 ${header.id === "remark" || header.id === "itemcode" || header.id === "brand_code" ? "pr-4" : "pr-2"}`}
                    style={{
                      justifyContent:
                        header.id === "remark" ||
                        header.id === "itemcode" ||
                        header.id === "brand_code"
                          ? "start"
                          : "end",
                    }}
                  >
                    <p>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </p>

                    {header.id !== "remark" ? (
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
          {table.getRowModel().rows.map((row) => {
            return (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                style={{
                  background: row.original.review?.is_changed
                    ? theme === "light"
                      ? "rgb(254 243 199)"
                      : "rgba(234, 179, 8, 0.2)"
                    : "",
                }}
                className={`h-[22px] `}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell
                      key={cell.id}
                      className="py-2 max-h-8 "
                      style={{ minWidth: cell.column.getSize() }}
                    >
                      <div className="max-h-8 h-8 flex items-center px-4 ">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </ShadcnTable>
    </>
  );
};

export default Table;
