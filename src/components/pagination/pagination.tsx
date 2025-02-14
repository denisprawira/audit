import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination as PaginationUI,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  total: number;
  perPage?: number;
  setPerPage?: (value: number) => void;
}

const Pagination = ({
  page: currentPage,
  setPage,
  total,
  perPage = 10,
  setPerPage,
}: PaginationProps) => {
  const [paginationValues, setPaginationValues] = useState({
    lastPage: Math.ceil(total / perPage),
    from: 1,
    to: Math.min(perPage, total),
  });

  useEffect(() => {
    const lastPage = Math.ceil(total / perPage);
    const from = (currentPage - 1) * perPage + 1;
    const to = Math.min(currentPage * perPage, total);

    setPaginationValues({ lastPage, from, to });
  }, [currentPage, perPage, total]);

  const handleRowsPerPageChange = (value: string) => {
    setPerPage?.(parseInt(value));
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const { lastPage } = paginationValues;

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
    <div className="flex items-center justify-between space-x-2 p-4 max-sm:flex-col gap-4 ">
      <div className="flex-1 text-sm text-muted-foreground">
        <span>
          Showing {paginationValues.from}-{paginationValues.to} of {total} rows
        </span>
      </div>

      <div className="flex items-center gap-6 max-sm:w-full max-sm:flex-col">
        {perPage && setPerPage && (
          <div className="flex items-center gap-2 max-sm:w-full">
            <span className="text-sm whitespace-nowrap">Rows per page</span>
            <Select
              value={perPage.toString()}
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
          <PaginationUI>
            <PaginationContent className="space-x-1">
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setPage(currentPage - 1)}
                  disabled={currentPage === 1}
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
                      isActive={currentPage === page}
                      onClick={() => setPage(page as number)}
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
                  onClick={() => setPage(currentPage + 1)}
                  disabled={
                    currentPage === paginationValues.lastPage ||
                    paginationValues.lastPage === 0
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </PaginationUI>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
