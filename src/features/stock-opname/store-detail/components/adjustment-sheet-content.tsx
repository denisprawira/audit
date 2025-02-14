import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PackageOpen, SquarePen, X } from "lucide-react";

import EmptyPlaceholder from "@/components/empty-placeholder/EmptyPlaceholder";
import Loader from "@/components/loader/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import AdjustmentCard from "@/features/stock-opname/store-detail/components/adjustment-card";
import EditAdjustmentCard from "@/features/stock-opname/store-detail/components/edit-adjustment";
import useSummary from "@/hooks/query/stock-opname/useSummary";
import { cn } from "@/lib/utils";
import { useFilters } from "@/stores/Data/useFilterStores";
import { useSheetStore } from "@/stores/ui/userSheetStore";
import { Adjustment, ISummaryData } from "@/types/data";
import { capitalizeFirstLetter } from "@/utils/string-helpers";
import {
  ISaveAdjustmentPayload,
  useSummaryMutation,
} from "@/hooks/mutation/useSummaryMutation";

const SheetContent = ({ data }: { data: ISummaryData[] }) => {
  // State and Store Hooks
  const { setOpen } = useSheetStore();
  const {
    scheduleID,
    storeCode,
    adjustmentFilters: { itemCode, brand, status },
  } = useFilters();
  const { summaryAdjustmentQuery } = useSummary({ scheduleID, itemCode });
  const { saveAdjustmentMutation } = useSummaryMutation();
  const [editAdjustmentData, setEditAdjustmentData] = useState<Adjustment>();
  const [showEditAdjustment, setShowEditAdjustment] = useState(false);
  const [mutationType, setMutationType] = useState<"create" | "edit">("create");

  const leftVariant = {
    visible: { x: 0 },
    hidden: { x: "-100%" },
  };

  const rightVariant = {
    visible: { x: 0 },
    hidden: { x: "100%" },
  };

  return (
    <div className="flex flex-col gap-6 max-h-full h-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0">
        <div className="space-y-4 sm:space-y-2 w-full">
          <div className="space-x-4">
            <Badge variant="outline">{storeCode}</Badge>
            <Badge variant="outline">{brand}</Badge>
          </div>
          <p>{itemCode}</p>
        </div>
        <div className="w-fit flex gap-2 items-center">
          <Button variant="secondary">
            <Checkbox
              defaultChecked={summaryAdjustmentQuery.data?.data.is_reviewed}
              onCheckedChange={(e) => {
                saveAdjustmentMutation.mutate({
                  scheduleID,
                  data: {
                    item_code: itemCode,
                    adjustment_type: status,
                    is_reviewed: e as boolean,
                  } as ISaveAdjustmentPayload,
                });
              }}
              className="cursor-pointer text-green-500 focus:ring-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
            />
            Mark as Reviewed
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="min-w-10 size-10 max-sm:hidden"
            onClick={() => setOpen(false)}
          >
            <X />
          </Button>
        </div>
      </div>

      {/* Adjustment Card Section */}
      <AnimatePresence>
        {!showEditAdjustment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Card className="bg-red p-4 flex flex-col items-center rounded-sm gap-4">
              <div className="flex gap-2 items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  {`Barang ${capitalizeFirstLetter(status)}`}
                  <Badge variant="outline">{`${data.filter((item) => item.item_code === itemCode)[0].difference ?? 0} pcs`}</Badge>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditAdjustment(true);
                    setMutationType("create");
                  }}
                >
                  <SquarePen /> Add Adjustment
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Section */}
      <div className={cn("overflow-x-hidden flex relative w-full h-full")}>
        {/* Adjustment List */}
        <motion.div
          className="w-full space-y-4"
          variants={leftVariant}
          animate={showEditAdjustment ? "hidden" : "visible"}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
        >
          {summaryAdjustmentQuery.isError && (
            <p className="text-red-500">
              {" "}
              {summaryAdjustmentQuery.error.message}
            </p>
          )}{" "}
          {summaryAdjustmentQuery.isPending && (
            <div className="absolute bg-gray-100/50 z-10 w-full h-full text-foreground flex gap-2 justify-center items-center">
              <Loader />
              Loading...
            </div>
          )}
          {(summaryAdjustmentQuery.data?.data.adjustments.length === 0 ||
            summaryAdjustmentQuery.error) && (
            <EmptyPlaceholder
              className="bg-muted-foreground/5"
              icon={<PackageOpen />}
              title="No Adjustment"
              description="No Adjustment"
            />
          )}
          {summaryAdjustmentQuery.data?.data.adjustments.map((item) => (
            <AdjustmentCard
              status={status}
              key={item.id}
              data={item}
              onClick={() => {
                setShowEditAdjustment(true);
                setEditAdjustmentData(item);
                setMutationType("edit");
              }}
            />
          ))}
        </motion.div>

        {/* Edit Adjustment Section */}
        <motion.div
          className="absolute overflow-hidden w-full"
          variants={rightVariant}
          animate={showEditAdjustment ? "visible" : "hidden"}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
        >
          <EditAdjustmentCard
            scheduleID={scheduleID}
            itemCode={itemCode}
            data={editAdjustmentData}
            type={mutationType}
            onCancel={() => setShowEditAdjustment(false)}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SheetContent;
