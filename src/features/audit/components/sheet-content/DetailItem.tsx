import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ExportDataDialog from "@/features/audit/components/data-export-dialog/DataExportDialog";
import DetailTable from "@/features/audit/components/detail-table/DetailTable";
import RemarkDialog from "@/features/audit/components/remark-dialog/RemarkDialog";
import { useFetchItemTransaction } from "@/hooks/query/useFetchItemTransaction";
import { useWarehouseOverviewDetailData } from "@/features/audit/stores/data/useItemOverviewStore";
import { useReviewStoreMutation } from "@/features/audit/stores/data/userReviewStore";
import { useWarehouseOverviewFilters } from "@/features/audit/stores/filters/useWarehouseOverviewFiltersStore";
import {
  useItemTransactionFiltersA,
  useItemTransactionFiltersB,
} from "@/features/audit/stores/filters/userItemTransactionFiltersStore";
import { Filter } from "@/features/audit/types/filters/WarehouseOverviewFilters";
import useWindowSize from "@/hooks/utils/useWindowSize";
import { useElementRefs } from "@/stores/ui/userRefsStore";
import { useSheetStore } from "@/stores/ui/userSheetStore";
import { WarehouseOverviewFilterNames } from "@/utils/enumeration";
import dayjs from "dayjs";
import { SquarePen, User, X } from "lucide-react";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

const DetailItem = () => {
  const { setOpen } = useSheetStore();
  const { width } = useWindowSize();
  const ref = useRef<HTMLDivElement>(null);
  const remarkRef = useRef<HTMLDivElement>(null);
  const { setRef } = useElementRefs();
  const { company } = useWarehouseOverviewFilters();
  const { warehouseOverviewData: itemData } = useWarehouseOverviewDetailData();
  const { setReviewStoreMutation } = useReviewStoreMutation();
  const { queryParams } = useWarehouseOverviewFilters();

  const {
    queryParams: itemQueryParamsA,
    updateQueryParams: updateQueryParamsA,
    removeFilter: removeFilterA,
  } = useItemTransactionFiltersA();
  const {
    queryParams: itemQueryParamsB,
    updateQueryParams: updateQueryParamsB,
    removeFilter: removeFilterB,
  } = useItemTransactionFiltersB();

  const queryA = useFetchItemTransaction(company, itemQueryParamsA);
  const queryB = useFetchItemTransaction(company, itemQueryParamsB);

  useEffect(() => {
    let errorMessage = undefined;
    if (queryA.isError || queryB.isError) {
      errorMessage =
        queryA.error?.message ||
        queryB.error?.message ||
        "An unknown error occurred";
    }
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [queryA.error, queryB.error]);

  useEffect(() => {
    if (ref) {
      setRef("detailToolbar", ref);
      setRef("remarkDetail", remarkRef);
    }
  }, [width]);

  return (
    <div className="flex flex-col gap-6 max-h-full ">
      <ExportDataDialog />
      <div ref={ref} className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 ">
        <div className="space-y-4 sm:space-y-2 w-full  ">
          <div className="space-x-4 ">
            <Badge variant="outline">{company}</Badge>
            <Badge variant="outline">{itemData?.brand_code}</Badge>
          </div>
          <p>{itemData?.itemcode}</p>
        </div>
        <div className="w-fit flex gap-2 items-center">
          <RemarkDialog>
            <Button variant={"outline"} disabled={itemData?.is_finalized}>
              <SquarePen />
              Add Remark
            </Button>
          </RemarkDialog>
          <Button variant={"secondary"} disabled={itemData?.is_finalized}>
            <Checkbox
              defaultChecked={itemData?.review?.is_reviewed}
              className=" cursor-pointer text-green-500 focus:ring-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              onCheckedChange={(checked) => {
                setReviewStoreMutation({
                  itemcode: itemData?.itemcode ?? "",
                  whscode: company,
                  brand_code: itemData?.brand_code,
                  db1: itemQueryParamsA.db,
                  db2: itemQueryParamsB.db,
                  remark: itemData?.review?.remark,
                  reviewer: itemData?.review?.reviewer,
                  cutoff_date:
                    itemQueryParamsA.cutoff_to || itemQueryParamsB.cutoff_to,
                  is_reviewed: checked as boolean,
                  qty_difference: itemData?.qty_difference,
                  qty_soh: itemData?.qty_soh,
                  qty_soh_1: itemData?.qty_soh_1,
                  brand_codes: (queryParams.filters?.find(
                    (f: Filter) =>
                      f.field === WarehouseOverviewFilterNames.BRAND_CODE,
                  )?.values || []) as string[],
                });
              }}
            />
            Mark as Reviewed
          </Button>
          <Button
            variant={"ghost"}
            size={"icon"}
            className=" min-w-10 size-10 max-sm:hidden"
            onClick={() => setOpen(false)}
          >
            <X />
          </Button>
        </div>
      </div>
      {itemData?.review && (
        <div
          ref={remarkRef}
          className="px-6 py-2 border-l-4 border-black space-y-2"
        >
          <p className="font-bold">Remark</p>
          <p>{`${itemData.itemcode} - ${company} : ${itemData.review.remark?.trim() || "-"}`}</p>
          <div className="flex gap-4 text-muted-foreground">
            <div className="flex gap-2">
              <User className="size-4" />
              {`${itemData.review.reviewer?.name ?? "No Reviewer"} (${itemData.review.reviewer?.role?.name ?? "No Role"})`}
            </div>
            <div>{`Updated ${dayjs(itemData.review.updated_at).format("DD MMMM YYYY")}`}</div>
          </div>
        </div>
      )}
      <div className="flex gap-4 flex-1 flex-col sm:flex-row">
        <DetailTable
          isReviewExist={itemData?.review ? true : false}
          query={queryA}
          filters={itemQueryParamsA}
          updateFilters={updateQueryParamsA}
          removeFilter={removeFilterA}
        />
        <DetailTable
          isReviewExist={itemData?.review ? true : false}
          query={queryB}
          filters={itemQueryParamsB}
          updateFilters={updateQueryParamsB}
          removeFilter={removeFilterB}
          listboxMargin
        />
      </div>
    </div>
  );
};
export default DetailItem;
