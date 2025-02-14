import { useMemo } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { IScanItemDetail } from "@/types/data";
import { formatNumberSeparator } from "@/utils/string-helpers";

export const scanItemDetailColdef = (): ColumnDef<IScanItemDetail>[] => {
  const columnsHelperBonus = createColumnHelper<IScanItemDetail>();
  // eslint-disable-next-line
  const colDef: ColumnDef<IScanItemDetail, any>[] = useMemo(() => {
    return [
      columnsHelperBonus.accessor("brand_code", {
        cell: (info) => (
          <div className="flex items-center space-x-2 justify-start">
            {info.row.original.brand_code}
          </div>
        ),
        header: "Brand",
        size: 250,
        meta: { align: "left" },
      }),
      columnsHelperBonus.accessor("item_code", {
        cell: (info) => (
          <div className="flex items-center space-x-2 justify-start">
            {info.row.original.item_code}
          </div>
        ),
        header: "Item Code",
        size: 250,
        meta: { align: "left" },
      }),
      columnsHelperBonus.accessor("barcode", {
        cell: (info) => (
          <div className="flex items-center space-x-2 justify-start">
            {info.row.original.barcode}
          </div>
        ),
        header: "Barcode",
        size: 250,
        meta: { align: "left" },
      }),
      columnsHelperBonus.accessor("qty", {
        cell: (info) => (
          <div className="flex items-center space-x-2 justify-start">
            {formatNumberSeparator(info.row.original.qty)}
          </div>
        ),
        header: "Scan",
        size: 250,
        meta: { align: "right" },
      }),
      // columnsHelperBonus.accessor("amount", {
      //   cell: (info) => (
      //     <div className="flex items-center space-x-2">
      //       {formatNumberSeparator(info.row.original.amount)}
      //     </div>
      //   ),
      //   header: "Amount",
      //   size: 200,
      //   meta: { align: "right" },
      // }),
    ];
  }, []);

  return colDef;
};
