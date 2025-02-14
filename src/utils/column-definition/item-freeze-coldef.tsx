import { useMemo } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { formatNumberSeparator } from "@/utils/string-helpers";
import { IFreezeData } from "@/types/data";

// eslint-disable-next-line
export const itemFreezeColdef = (): ColumnDef<IFreezeData>[] => {
  // eslint-disable-next-line
  const columnsHelperBonus = createColumnHelper<IFreezeData>();
  // eslint-disable-next-line
  const colDef: ColumnDef<IFreezeData, any>[] = useMemo(() => {
    return [
      columnsHelperBonus.accessor("brand_code", {
        cell: (info) => (
          <div className="flex items-center space-x-2 justify-start ">
            {info.row.original.brand_code}
          </div>
        ),
        header: "Brand",
        size: 250,
        meta: { align: "left" },
      }),
      columnsHelperBonus.accessor("item_code", {
        cell: (info) => (
          <div className="flex items-center space-x-2 justify-start ">
            {info.row.original.item_code}
          </div>
        ),
        header: "Item Code",
        size: 250,
        meta: { align: "left" },
      }),
      columnsHelperBonus.accessor("barcode", {
        cell: (info) => (
          <div className="flex items-center space-x-2 justify-start ">
            {info.row.original.barcode}
          </div>
        ),
        header: "Barcode",
        size: 250,
        meta: { align: "left" },
      }),
      columnsHelperBonus.accessor("description", {
        cell: (info) => (
          <div className="flex items-center space-x-2 w-fit">
            {info.row.original.description}
          </div>
        ),
        header: "Description",
        size: 500,
        meta: { align: "left" },
      }),
      columnsHelperBonus.accessor("qty", {
        cell: (info) => (
          <div className="flex items-center space-x-2 ">
            {formatNumberSeparator(info.row.original.qty)}
          </div>
        ),
        header: "Freeze",
        meta: { align: "right" },
      }),
      // columnsHelperBonus.accessor("amount_price", {
      //   cell: (info) => (
      //     <div className="flex items-center space-x-2">
      //       {formatNumberSeparator(info.row.original.amount_price)}
      //     </div>
      //   ),
      //   header: "Amount",
      //   meta: { align: "right" },
      // }),
    ];
  }, []);

  return colDef;
};
