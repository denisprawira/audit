import { useMemo } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ISummaryData } from "@/types/data";
import {
  capitalizeFirstLetter,
  formatNumberSeparator,
} from "@/utils/string-helpers";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSheetStore } from "@/stores/ui/userSheetStore";
import { useFilters } from "@/stores/Data/useFilterStores";
import { AdjustmentType } from "@/utils/enumeration";
import { useSummaryMutation } from "@/hooks/mutation/useSummaryMutation";

export const itemSummaryColdef = (): ColumnDef<ISummaryData>[] => {
  const columnsHelper = createColumnHelper<ISummaryData>();
  // eslint-disable-next-line
  const { setOpen } = useSheetStore();
  // eslint-disable-next-line
  const { saveAdjustmentMutation } = useSummaryMutation();
  // eslint-disable-next-line
  const { setAdjustmentFilters } = useFilters();
  // eslint-disable-next-line
  const { scheduleID } = useFilters();
  // eslint-disable-next-line
  const colDef: ColumnDef<ISummaryData, any>[] = useMemo(() => {
    return [
      // columnsHelper.accessor("location_name", {
      //   cell: (info) => (
      //     <div className="flex items-center space-x-2 justify-start ">
      //       {info.row.original.location_name ?? "-"}
      //     </div>
      //   ),
      //   header: "Location",
      //   size: 250,

      //   meta: { align: "left", rowspan: 2 },
      // }),
      columnsHelper.accessor("brand_code", {
        cell: (info) => (
          <div className="flex items-center space-x-2 justify-start">
            {info.row.original.brand_code}
          </div>
        ),
        header: "Brand",
        size: 250,
        meta: { align: "left", rowspan: 2 },
      }),
      columnsHelper.accessor("item_code", {
        cell: (info) => (
          <div className="flex items-center space-x-2 justify-start ">
            {info.row.original.item_code}
          </div>
        ),
        header: "Item Code",
        size: 250,
        meta: { align: "left" },
      }),
      //grouping column
      columnsHelper.group({
        header: "Freeze",
        meta: { align: "center" },
        columns: [
          columnsHelper.accessor("freeze_qty", {
            cell: (info) => formatNumberSeparator(info.getValue()),
            header: "Qty",
          }),
          // columnsHelper.accessor("freeze_amount", {
          //   id: "freeze_amount",
          //   cell: (info) => formatNumberSeparator(info.getValue()),
          //   header: "Amount",
          // }),
        ],
      }),
      columnsHelper.group({
        header: "Scan",
        meta: { align: "center" },
        columns: [
          columnsHelper.accessor("scan_qty", {
            id: "scan_qty",
            cell: (info) => formatNumberSeparator(info.getValue()),
            header: "Qty",
          }),
          // columnsHelper.accessor("scan_amount", {
          //   id: "scan_amount",
          //   cell: (info) => formatNumberSeparator(info.getValue()),
          //   header: "Amount",
          // }),
        ],
      }),
      columnsHelper.group({
        header: "Difference",
        meta: { align: "center" },
        columns: [
          columnsHelper.accessor("difference", {
            cell: (info) => formatNumberSeparator(info.getValue()),
            header: "Qty",
          }),
          // columnsHelper.accessor("difference_amount", {
          //   cell: (info) => formatNumberSeparator(info.getValue()),
          //   header: "Amount",
          // }),
        ],
      }),
      columnsHelper.accessor("status", {
        cell: (info) => {
          const value = info.row.original.status;
          const outline =
            value === AdjustmentType.Minus
              ? "border-red-500 text-red-500 bg-red-50"
              : value === AdjustmentType.Plus
                ? "border-blue-500 text-blue-500 bg-blue-50"
                : "";

          return (
            <div className="flex items-center space-x-2 justify-start ">
              <Badge className={`${outline}`} variant={"outline"}>
                {capitalizeFirstLetter(info.row.original.status ?? "-")}
              </Badge>
            </div>
          );
        },
        header: "Status",
        size: 150,
        meta: { align: "left" },
      }),
      columnsHelper.accessor("is_reviewed", {
        cell: (info) => {
          return (
            <div className="flex items-center space-x-2 justify-start ">
              <Checkbox
                defaultChecked={
                  info.row.original.is_reviewed ||
                  info.row.original.status === AdjustmentType.Equal
                }
                disabled={info.row.original.status === AdjustmentType.Equal}
                onCheckedChange={(e) => {
                  saveAdjustmentMutation.mutate({
                    scheduleID: scheduleID,
                    data: {
                      item_code: info.row.original.item_code,
                      adjustment_type: info.row.original.status,
                      is_reviewed: e as boolean,
                    },
                  });
                }}
                className=" cursor-pointer text-green-500 focus:ring-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />
              <Button
                variant={"ghost"}
                disabled={info.row.original.status === AdjustmentType.Equal}
                onClick={() => {
                  setOpen(true);
                  setAdjustmentFilters({
                    itemCode: info.row.original.item_code,
                    brand: info.row.original.brand_code,
                    qtyDifference: info.row.original.difference,
                    isReview: info.row.original.is_reviewed,
                    status: info.row.original.status,
                  });
                }}
              >
                <ChevronRight />
              </Button>
            </div>
          );
        },
        header: "Review",
        size: 100,
        meta: { align: "left" },
      }),
    ];
  }, []);

  return colDef;
};
