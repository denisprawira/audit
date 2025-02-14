import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useWarehouseOverviewDetailData } from "@/features/audit/stores/data/useItemOverviewStore";
import { useReviewStoreMutation } from "@/features/audit/stores/data/userReviewStore";
import { useWarehouseOverviewFilters } from "@/features/audit/stores/filters/useWarehouseOverviewFiltersStore";
import {
  useItemTransactionFiltersA,
  useItemTransactionFiltersB,
} from "@/features/audit/stores/filters/userItemTransactionFiltersStore";
import {
  IWarehouseOverviewData,
  IWarehouseReview,
} from "@/features/audit/types/data/WarehouseTypes";
import { useSheetStore } from "@/stores/ui/userSheetStore";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { limitCharacters } from "@/utils/string-helpers";
import { WarehouseOverviewFilterNames } from "@/utils/enumeration";
import { Filter } from "@/features/audit/types/filters/WarehouseOverviewFilters";

export const useColdefStore = (): ColumnDef<IWarehouseOverviewData>[] => {
  const { queryParams, company } = useWarehouseOverviewFilters();
  const { warehouseOverviewData } = useWarehouseOverviewDetailData();
  const {
    queryParams: { db1, db2, cutoff_to, filters },
  } = useWarehouseOverviewFilters();
  const { setReviewStoreMutation } = useReviewStoreMutation();
  const colDef: ColumnDef<IWarehouseOverviewData>[] = useMemo(() => {
    return [
      {
        accessorKey: "itemcode",
        header: "Item Code",
        size: 250,
        enableSorting: true,
        cell: (info) => {
          return (
            <p
              className={`${info.row.original.is_finalized ? "text-black/35 dark:text-white/35 " : ""}`}
            >
              {info.getValue() as string}
            </p>
          );
        },
      },
      {
        accessorKey: "brand_code",
        header: "Brand Code",
        size: 162,
        enableSorting: true,
        cell: (info) => {
          return (
            <p
              className={`${info.row.original.is_finalized ? "text-black/35 dark:text-white/35 " : ""}`}
            >
              {info.getValue() as string}
            </p>
          );
        },
      },

      {
        accessorKey: "qty_soh",
        header: db1,
        size: 151,
        enableSorting: true,
        cell: (info) => {
          const value: number = info.getValue() as number;
          return (
            <div
              className={`text-end w-full ${info.row.original.is_finalized ? "text-black/35 dark:text-white/35 " : ""}`}
            >
              {value.toLocaleString()}
            </div>
          );
        },
      },
      {
        accessorKey: "qty_soh_1",
        header: db2,
        size: 151,
        enableSorting: true,
        cell: (info) => {
          const value: number = info.getValue() as number;
          return (
            <div
              className={`text-end w-full ${info.row.original.is_finalized ? "text-black/35 dark:text-white/35 " : ""}`}
            >
              {value.toLocaleString()}
            </div>
          );
        },
      },
      {
        accessorKey: "qty_difference",
        header: "Difference",
        size: 151,
        enableSorting: true,
        cell: (info) => {
          const value: number = info.getValue() as number;
          return (
            <div
              className={`text-end w-full ${info.row.original.is_finalized ? "text-black/35 dark:text-white/35 " : ""}`}
            >
              {value.toLocaleString()}
            </div>
          );
        },
      },
      {
        accessorKey: "review",
        enableSorting: true,
        header: () => <span className="">{"Review"}</span>,
        size: 200,
        cell: (info) => {
          const review = info.row.getValue("review") as IWarehouseReview | null;
          const isChecked = review?.is_reviewed ?? false;
          const isFinalized = info.row.original.is_finalized ?? false;
          const brandCodes =
            (filters?.find(
              (f: Filter) =>
                f.field === WarehouseOverviewFilterNames.BRAND_CODE,
            )?.values as string[]) || [];
          return (
            <div className="flex w-full justify-end">
              <Checkbox
                disabled={isFinalized}
                key={`${info.row.original.itemcode}-${isChecked}`}
                defaultChecked={isChecked as boolean}
                className={`cursor-pointer  data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500  ${isFinalized && `data-[state=checked]:bg-gray-500 data-[state=checked]:border-gray-500`}`}
                onCheckedChange={(checked) => {
                  setReviewStoreMutation({
                    itemcode: info.row.original.itemcode,
                    whscode: company,
                    db1: db1,
                    db2: db2,
                    cutoff_date: cutoff_to,
                    remark: info.row.original.review?.remark,
                    is_reviewed: checked as boolean,
                    qty_soh: info.row.original.qty_soh,
                    qty_soh_1: info.row.original.qty_soh_1,
                    qty_difference: info.row.original.qty_difference,
                    brand_code: info.row.original.brand_code,
                    brand_codes: brandCodes,
                  });
                }}
              />
            </div>
          );
        },
      },
      {
        accessorKey: "remark",
        header: "Remark",
        enableSorting: false,
        size: 275,
        cell: (info) => {
          const value: IWarehouseReview = info.row.getValue(
            "review",
          ) as IWarehouseReview;
          return (
            <div className="flex justify-between items-center w-full">
              <div
                className={`whitespace-nowrap ${info.row.original.is_finalized ? "text-black/35 dark:text-white/35 " : ""}`}
              >
                {value?.remark ? limitCharacters(value.remark, 80) : "-"}
              </div>
              <Button
                variant={"ghost"}
                onClick={() => {
                  const rowValue = info.row.original as IWarehouseOverviewData;
                  useSheetStore.getState().setOpen(true);
                  useItemTransactionFiltersA.getState().updateQueryParams({
                    db: db1,
                    itemcode: rowValue.itemcode,
                    cutoff_to: queryParams.cutoff_to,
                  });
                  useItemTransactionFiltersB.getState().updateQueryParams({
                    db: db2,
                    itemcode: rowValue.itemcode,
                    cutoff_to: cutoff_to,
                  });

                  useWarehouseOverviewDetailData
                    .getState()
                    .setWarehouseOverviewData(rowValue);
                }}
              >
                <ChevronRight />
              </Button>
            </div>
          );
        },
      },
    ];
  }, [cutoff_to, filters, company, warehouseOverviewData, db1, db2]);

  return colDef;
};
