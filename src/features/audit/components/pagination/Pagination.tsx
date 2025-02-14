import { forwardRef, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { IMetaData } from "@/types/network/Response";

interface PaginationProps<T> {
  table: Table<T>;
  showRowPerPage?: boolean;
  meta?: IMetaData | null;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (value: number) => void;
}

//eslint-disable-next-line
const TablePagination = forwardRef<HTMLDivElement, PaginationProps<any>>(
  (
    { table, showRowPerPage = true, meta, onPageChange, onRowsPerPageChange },
    ref,
  ) => {
    const [paginationValues, setPaginationValues] = useState({
      currentPage: 1,
      lastPage: 1,
      totalRows: 0,
      rowsPerPage: 10,
      from: 1,
      to: 10,
    });

    useEffect(() => {
      setPaginationValues({
        currentPage:
          meta?.current_page ?? table.getState().pagination.pageIndex + 1,
        lastPage: meta?.last_page ?? table.getPageCount(),
        totalRows: meta?.total ?? table.getRowCount(),
        rowsPerPage: meta?.per_page ?? table.getState().pagination.pageSize,
        from:
          meta?.from ??
          ((meta?.current_page ?? table.getState().pagination.pageIndex + 1) -
            1) *
            (meta?.per_page ?? table.getState().pagination.pageSize) +
            1,
        to:
          meta?.to ??
          Math.min(
            (meta?.current_page ?? table.getState().pagination.pageIndex + 1) *
              (meta?.per_page ?? table.getState().pagination.pageSize),
            meta?.total ?? table.getRowCount(),
          ),
      });
    }, [meta, table]);

    const handleRowsPerPageChange = (value: string) => {
      onRowsPerPageChange?.(parseInt(value));
    };

    const generatePageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      const { currentPage, lastPage } = paginationValues;

      if (lastPage <= maxVisiblePages) {
        for (let i = 1; i <= lastPage; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 3; i++) {
            pages.push(i);
          }
          pages.push("ellipsis");
          pages.push(lastPage);
        } else if (currentPage >= lastPage - 2) {
          pages.push(1);
          pages.push("ellipsis");
          for (let i = lastPage - 2; i <= lastPage; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push("ellipsis");
          pages.push(currentPage - 1);
          pages.push(currentPage);
          pages.push(currentPage + 1);
          pages.push("ellipsis");
          pages.push(lastPage);
        }
      }

      return pages;
    };

    return (
      <div
        ref={ref}
        className="flex items-center justify-between space-x-2 p-4 max-sm:flex-col gap-4"
      >
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <span className="mr-2">
              {table.getFilteredSelectedRowModel().rows.length} selected.
            </span>
          )}
          <span>
            Showing {paginationValues.from}-{paginationValues.to} of{" "}
            {paginationValues.totalRows} rows
          </span>
        </div>

        <div className="flex items-center gap-6 max-sm:w-full max-sm:flex-col">
          {showRowPerPage && (
            <div className="flex items-center gap-2 max-sm:w-full">
              <span className="text-sm whitespace-nowrap">Rows per page</span>
              <Select
                value={paginationValues.rowsPerPage.toString()}
                onValueChange={handleRowsPerPageChange}
              >
                <SelectTrigger className="h-8 w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {[10, 25, 50, 100].map((value) => (
                      <SelectItem key={value} value={value.toString()}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center gap-4">
            <Pagination>
              <PaginationContent className="space-x-1">
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() =>
                      onPageChange?.(paginationValues.currentPage - 1)
                    }
                    disabled={paginationValues.currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </PaginationItem>
                {generatePageNumbers().map((page, index) => {
                  if (page === "ellipsis") {
                    return (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        className="cursor-pointer h-8 w-8 p-0"
                        isActive={paginationValues.currentPage === page}
                        onClick={() => onPageChange?.(page as number)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      onPageChange?.(paginationValues.currentPage + 1);
                    }}
                    disabled={
                      paginationValues.currentPage === paginationValues.lastPage
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    );
  },
);

TablePagination.displayName = "TablePagination";

export default TablePagination;
