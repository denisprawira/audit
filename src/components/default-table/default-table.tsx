import React, { useMemo, useCallback } from "react";
import EmptyPlaceholder from "@/components/empty-placeholder/EmptyPlaceholder";
import Loader from "@/components/loader/Loader";
import Pagination from "@/components/pagination/pagination";
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  OnChangeFn,
  SortingState,
  useReactTable,
  HeaderGroup,
  Header,
  Row,
  Cell,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  SearchX,
  Table2,
} from "lucide-react";

interface TableProps<T> {
  coldef: ColumnDef<T>[];
  data: T[];
  isFetching?: boolean;
  isLoading?: boolean;
  isSearchActive?: boolean;
  page?: number;
  perPage?: number;
  setPage?: (page: number) => void;
  setPerPage?: (page: number) => void;
  totalPage?: number;
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState> | undefined;
  headerVerticalBorder?: boolean;
  status?: "pending" | "success" | string;
}

const DefaultTable = <T,>({
  coldef,
  data,
  isFetching,
  isLoading,
  isSearchActive = false,
  page,
  perPage,
  setPage,
  setPerPage,
  headerVerticalBorder = false,
  sorting,
  setSorting,
  totalPage = 0,
  status,
}: TableProps<T>) => {
  const table = useReactTable<T>({
    columns: coldef,
    data: data || [],
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

  const computedEmptyPlaceholder = useMemo(() => {
    if (data.length === 0 && isSearchActive) {
      return (
        <EmptyPlaceholder
          icon={
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-gray-600/20 flex justify-center items-center">
              <SearchX />
            </div>
          }
          title="No Result"
          description="We don’t find what you’re looking for"
        />
      );
    }
    return (
      <EmptyPlaceholder
        icon={
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-gray-600/20  flex justify-center items-center">
            <Table2 />
          </div>
        }
        title="No Data Available"
        description="We couldn’t find any data to display right now. Try adjusting your filters or check back later"
      />
    );
  }, [data.length, isSearchActive, status]);

  const renderHeaderGroup = useCallback(
    (headerGroup: HeaderGroup<T>) => (
      <TableRow
        key={headerGroup.id}
        className={cn("h-fit", {
          "[&>th]:border-r last:[&>th]:border-r-0": headerVerticalBorder,
        })}
      >
        {headerGroup.headers.map((header: Header<T, unknown>) => {
          // Optionally set a rowSpan if provided in the column meta.
          const rowSpan = header.column.columnDef.meta?.rowspan;
          if (rowSpan && !header.isPlaceholder) {
            // Modifying header.rowSpan here; ensure that this is acceptable for your use case.
            header.rowSpan = 2;
          }
          return (
            <TableHead
              key={header.id}
              colSpan={header.colSpan}
              className="border-b"
              style={{ width: header.getSize(), position: "relative" }}
            >
              <div
                className="flex px-4 py-3 max-h-4 items-center gap-2"
                style={{
                  justifyContent:
                    header.column.columnDef.meta?.align || "start",
                }}
              >
                <p className="font-medium">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </p>
                {header.id !== "remark" && header.subHeaders.length === 0 ? (
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
          );
        })}
      </TableRow>
    ),
    [headerVerticalBorder],
  );

  // Memoize row rendering to prevent re-creation on every render.
  const renderRow = useCallback((row: Row<T>) => {
    return (
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() ? "selected" : undefined}
        className="h-[22px]"
      >
        {row.getVisibleCells().map((cell: Cell<T, unknown>) => (
          <TableCell
            key={cell.id}
            className="py-2 max-h-8 border-b"
            style={{ minWidth: cell.column.getSize() }}
          >
            <div
              className="max-h-8 h-8 flex items-center px-4"
              style={{
                justifyContent: cell.column.columnDef.meta?.align || "start",
              }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          </TableCell>
        ))}
      </TableRow>
    );
  }, []);

  return (
    <div className="flex flex-col h-full overflow-auto">
      <ShadcnTable
        className="border-separate"
        loadingComponent={
          <div className="absolute inset-0 w-full h-full gap-2 flex justify-center items-center bg-gray-50 dark:bg-black/30 bg-opacity-75">
            <Loader />
          </div>
        }
        isEmpty={data.length === 0}
        isLoading={isFetching || isLoading}
        emptyPlaceholder={computedEmptyPlaceholder}
        slotProps={{
          container: {
            className: cn(
              "flex-1 rounded-md border rounded-lg overflow-hidden max-sm:min-h-40 max-h-full",
            ),
          },
        }}
      >
        <TableHeader className="sticky top-0 h-fit bg-background">
          {table
            .getHeaderGroups()
            .map((headerGroup) => renderHeaderGroup(headerGroup))}
        </TableHeader>

        <TableBody className="overflow-y-auto">
          {table.getRowModel().rows.map((row: Row<T>) => renderRow(row))}
        </TableBody>
      </ShadcnTable>
      {page && setPage && (
        <Pagination
          page={page}
          setPage={setPage}
          perPage={perPage}
          setPerPage={setPerPage}
          total={totalPage}
        />
      )}
    </div>
  );
};

export default React.memo(DefaultTable) as typeof DefaultTable;
