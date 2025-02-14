import { useMemo } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import { IScheduleData } from "@/types/data";
import { useFilters } from "@/stores/Data/useFilterStores";
import { formatEnumSnakeCase } from "@/utils/string-helpers";
import { ScheduleType } from "@/utils/enumeration";
import { useSummaryMutation } from "@/hooks/mutation/useSummaryMutation";

export const useColdefSoStore = (): ColumnDef<IScheduleData>[] => {
  const columnsHelperBonus = createColumnHelper<IScheduleData>();
  const navigate = useNavigate();
  const { setScheduleID, setStoreCode } = useFilters();
  const { setScannedBy } = useFilters();
  const { finalizeSummary } = useSummaryMutation();

  // eslint-disable-next-line
  const colDef: ColumnDef<IScheduleData, any>[] = useMemo(() => {
    return [
      columnsHelperBonus.accessor("store_code", {
        cell: (info) => (
          <div className="flex items-center space-x-2 justify-start ">
            {info.row.original.store_code}
          </div>
        ),
        header: "Store",
        size: 250,
        meta: { align: "left" },
      }),
      columnsHelperBonus.accessor("start_date", {
        id: "start_date",
        cell: (info) => {
          const startDate = dayjs(info.row.original.start_date).format(
            "DD MMM YYYY",
          );
          const endDate = dayjs(info.row.original.end_date).format(
            "DD MMM YYYY",
          );
          return (
            <div className="flex items-center space-x-2 justify-start">
              {startDate || "N/A"} {" - "}
              {endDate || "N/A"}
            </div>
          );
        },
        header: "Date",
        size: 250,
      }),
      columnsHelperBonus.accessor("status", {
        cell: (info) => {
          const status = info.row.original.status;
          const statusClassName =
            status === ScheduleType.IN_PROGRESS
              ? "bg-green-100 text-green-600 ring-green-600 font-normal"
              : status === ScheduleType.COMPLETED
                ? "bg-blue-100 text-blue-600  ring-blue-600 font-normal"
                : "";

          return (
            <div className="flex items-center space-x-2">
              <Badge className={`w-full ${statusClassName}`} variant="outline">
                {formatEnumSnakeCase(status)}
              </Badge>
            </div>
          );
        },
        header: "Status",
        size: 200,
      }),
      columnsHelperBonus.accessor("total_qty", {
        cell: (info) => (
          <div className="flex items-center space-x-2">
            {info.row.original.total_qty ?? 0}
          </div>
        ),
        header: "Barang Dagang",
        size: 200,
        meta: { align: "right" },
      }),
      columnsHelperBonus.accessor("total_qty", {
        cell: () => <div className="flex items-center space-x-2">{"-"}</div>,
        header: "Barang Non-Dagang",
        meta: { align: "right" },
      }),
      columnsHelperBonus.accessor("finalize_data", {
        cell: (info) => (
          <div className="flex justify-between items-center w-full">
            <div className={`whitespace-nowrap w-full flex justify-center`}>
              <Checkbox
                key={info.row.original.id}
                onCheckedChange={(e) => {
                  e && finalizeSummary.mutate(info.row.original.id);
                }}
                defaultChecked={info.row.original.finalize_data ? true : false}
                className={`cursor-pointer  data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500  `}
              />{" "}
            </div>
            <Button
              variant={"ghost"}
              onClick={() => {
                navigate("/stock-opname/store/detail");
                setScannedBy(info.row.original.assignees);
                setScheduleID(info.row.original.id);
                setStoreCode(info.row.original.store_code);
              }}
            >
              <ChevronRight />
            </Button>
          </div>
        ),
        header: "Finalized",
      }),
    ];
  }, []);

  return colDef;
};
