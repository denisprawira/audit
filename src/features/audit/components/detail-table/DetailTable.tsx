import {
  flexRender,
  getCoreRowModel,
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

import { cn } from "@/lib/utils";
import DetailTableToolbar from "@/features/audit/components/detail-table-toolbar/DetailTableToolbar";
import Pagination from "@/features/audit/components/pagination/Pagination";
import { useEffect, useRef, useState } from "react";
import useWindowSize from "@/hooks/utils/useWindowSize";
import { useElementRefs } from "@/stores/ui/userRefsStore";
import { IItemTransactionQueryParams } from "@/features/audit/types/filters/ItemTransactionFilters";
import { ITransactionResponse } from "@/features/audit/types/data/TransactionTypes";
import { UseQueryResult } from "@tanstack/react-query";
import { Table2 } from "lucide-react";
import EmptyPlaceholder from "@/components/empty-placeholder/EmptyPlaceholder";
import Loader from "@/components/loader/Loader";
import { useTheme } from "@/components/theme-provider/ThemeProvider";
import { useDetailColdefStore } from "@/features/audit/utils/column/DetailColDef";

const DetailTable = ({
  query,
  updateFilters,
  removeFilter,
  listboxMargin = false,
  isReviewExist = false,
  filters,
}: {
  query: UseQueryResult<ITransactionResponse, { message: string }>;
  filters: IItemTransactionQueryParams;
  updateFilters: (newParams: Partial<IItemTransactionQueryParams>) => void;
  removeFilter: (fieldName: string) => void;
  listboxMargin?: boolean;
  isReviewExist?: boolean;
}) => {
  const [columnVisibility, setColumnVisibility] = useState({});
  const coldef = useDetailColdefStore(filters.db);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const { refs } = useElementRefs();
  const [containerHeight, setContainerHeight] = useState<number>(0);
  // const [sorting, setSorting] = useState<SortingState>([]);
  const { theme } = useTheme();

  const table = useReactTable({
    columns: coldef.map((col) => ({
      ...col,
      enableSorting: true,
    })),
    data: query.data?.transactions.data ?? [],
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
      // sorting,
    },
    onColumnVisibilityChange: setColumnVisibility,
    // onSortingChange: setSorting,
    defaultColumn: {
      size: 200,
      minSize: 50,
      maxSize: 500,
    },
    // manualSorting: true,
    manualPagination: true,
  });

  useEffect(() => {
    const calculateHeight = () => {
      const toolbar = toolbarRef.current?.clientHeight || 0;
      const pagination = paginationRef.current?.clientHeight || 0;
      const remarkDetail = refs?.remarkDetail?.current?.clientHeight || 0;
      const detailToolbarHeight =
        refs?.detailToolbar?.current?.clientHeight || 0;
      const totalHeight =
        toolbar + pagination + detailToolbarHeight + remarkDetail;
      if (totalHeight > 0) {
        setContainerHeight(totalHeight);
      }
    };

    calculateHeight();
  }, [refs.detailToolbar, toolbarRef, paginationRef, width]);

  const handlePageChange = (page: number) => {
    updateFilters({
      page: page,
    });
  };

  // useEffect(() => {
  //   if (sorting.length !== 0) {
  //     updateFilters({
  //       sorts: {
  //         [sorting[0].id]: sorting[0].desc ? "desc" : "asc",
  //       },
  //     });
  //   } else {
  //     updateFilters({
  //       sorts: {},
  //     });
  //   }
  // }, [sorting]);

  return (
    <div className="flex-1 w-full  sm:overflow-auto sm:overflow-y-hidden ">
      <div className={"border rounded-lg "}>
        <DetailTableToolbar
          title={filters.db}
          listboxMargin={listboxMargin}
          ref={toolbarRef}
          table={table}
          updateFilters={updateFilters}
          removeFilter={removeFilter}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          filters={query.data?.filters}
        />
        <ShadcnTable
          isLoading={query.isLoading}
          isEmpty={query?.data?.transactions?.data.length === 0}
          loadingComponent={
            <div className="w-full h-full gap-2  absolute flex justify-center items-center bg-gray-50 dark:bg-black/30 bg-opacity-75 z-[2]">
              <Loader />
            </div>
          }
          emptyPlaceholder={
            <EmptyPlaceholder
              icon={
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-gray-600/20  flex justify-center items-center">
                  <Table2 />
                </div>
              }
              title="Table is empty"
              description="Turn the column on to show up here"
            />
          }
          slotProps={{
            container: {
              style: {
                maxHeight:
                  width < 640
                    ? `90vh`
                    : `calc(100vh - ${containerHeight}px - 4.5rem ${isReviewExist ? " - 1.5rem" : ""})`,
                height:
                  width < 640
                    ? `90vh`
                    : `calc(100vh - ${containerHeight}px - 4.5rem ${isReviewExist ? " - 1.5rem" : ""})`,
              },
              className: cn(
                "flex-1 border-t ",
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
                    style={{ minWidth: header.getSize() }}
                    className={cn("px-4 py-2 h-4")}
                  >
                    <div className="flex gap-2 items-center">
                      {" "}
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {/* <span
                        className="cursor-pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {{
                          asc: <ChevronUp className="size-4" />,
                          desc: <ChevronDown className="size-4" />,
                        }[header.column.getIsSorted() as string] ?? (
                          <ChevronsUpDown className="size-4" />
                        )}
                      </span> */}
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
                style={{
                  background: ["itr", "po"].includes(
                    row.original.busproc.toLowerCase(),
                  )
                    ? theme === "light"
                      ? "rgb(235, 251, 238)"
                      : "rgb(54 83 20)"
                    : "",
                }}
                className="h-[22px]"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="py-2 "
                    style={{ minWidth: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </ShadcnTable>
      </div>
      {/* pagination */}
      <Pagination
        ref={paginationRef}
        table={table}
        meta={query?.data?.transactions?.meta}
        showRowPerPage={false}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
export default DetailTable;
