import { ConfirmDialog } from "@/components/confirm-dialog/confirm-dialog";
import Loader from "@/components/loader/Loader";
import { Button } from "@/components/ui/button";
import CustomCard from "@/features/stock-opname/store-detail/components/overview/card";
import EditAssigneesModal from "@/features/stock-opname/store-detail/components/overview/edit-assignees-modal";
import EditPeriodModal from "@/features/stock-opname/store-detail/components/overview/edit-period-modal";
import useScheduleMutation from "@/hooks/mutation/useScheduleMutation";
import useSchedule from "@/hooks/query/stock-opname/useSchedule";
import { useFilters } from "@/stores/Data/useFilterStores";
import dayjs from "dayjs";
import { SquarePen } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";

const OverviewPage = () => {
  const { scheduleID, storeCode } = useFilters();

  const scheduleQuery = useSchedule({
    uuid: scheduleID,
    roleCode: ["SO"],
  });
  const scheduleMutation = useScheduleMutation();
  const { scheduleOverviewQuery } = scheduleQuery;
  const { deleteScheduleMutation } = scheduleMutation;

  useEffect(() => {
    scheduleOverviewQuery.error?.message &&
      toast.error(scheduleOverviewQuery.error?.message);
  }, [scheduleOverviewQuery.error]);

  return (
    <div className="relative w-full h-full">
      {scheduleOverviewQuery.isPending && (
        <div className="absolute bg-muted-foreground/5 z-10 w-full h-full text-foreground flex gap-2 justify-center items-center">
          <Loader />
          Loading...
        </div>
      )}
      <div className="flex flex-col w-full overflow-y-scroll gap-4 max-sm:px-6 px-6 py-6  relative">
        <p className="font-semibold">{`PS ${storeCode}`}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <CustomCard title="Qty Barang Dagang">
            {scheduleOverviewQuery.data?.data.total_qty ?? "-"}
          </CustomCard>
          <CustomCard title="Amount Barang Dagang">{"-"}</CustomCard>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <CustomCard title="Qty Barang Non-Dagang">{"-"}</CustomCard>
          <CustomCard title="Amount Barang Non-Dagang">{"-"}</CustomCard>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <CustomCard
            title="Periode"
            leftComponent={
              <EditPeriodModal
                scheduleHook={scheduleQuery}
                scheduleMutation={scheduleMutation}
              >
                <SquarePen className="size-4 cursor-pointer" />
              </EditPeriodModal>
            }
          >{`${scheduleOverviewQuery.data?.data?.start_date ? dayjs(scheduleOverviewQuery.data?.data?.start_date).format("DD MMM YYYY") : "N/A"} - ${scheduleOverviewQuery.data?.data?.end_date ? dayjs(scheduleOverviewQuery.data?.data?.end_date).format("DD MMM YYYY") : "N/A"}`}</CustomCard>
          <CustomCard title="Minggu">
            {scheduleOverviewQuery.data?.data?.week ?? "-"}
          </CustomCard>
          <CustomCard title="Status">
            {scheduleOverviewQuery.data?.data?.status ?? "-"}
          </CustomCard>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <CustomCard title="Area Manager">
            {scheduleOverviewQuery.data?.data?.area_manager ?? "-"}
          </CustomCard>
          <CustomCard title="Senior Store Head">
            {scheduleOverviewQuery.data?.data?.senior_store_head ?? "-"}
          </CustomCard>
          <CustomCard
            title="Team SO"
            leftComponent={
              <EditAssigneesModal
                scheduleHook={scheduleQuery}
                scheduleMutation={scheduleMutation}
              >
                <SquarePen className="size-4 cursor-pointer" />
              </EditAssigneesModal>
            }
          >
            {(scheduleOverviewQuery.data?.data?.assignees &&
              scheduleOverviewQuery.data?.data?.assignees.map((assignee) => (
                <div>{assignee.name}</div>
              ))) ??
              "-"}
          </CustomCard>
        </div>

        <ConfirmDialog
          title="Delete Schedule"
          content={<p>Are you sure?</p>}
          isLoading={deleteScheduleMutation.isPending}
          isDisabled={deleteScheduleMutation.isPending}
          onClick={() => {
            scheduleMutation.deleteScheduleMutation.mutate(
              scheduleOverviewQuery.data?.data?.id ?? "",
            );
          }}
        >
          <Button className="w-full sm:w-fit" variant={"destructive"}>
            Delete Schedule
          </Button>
        </ConfirmDialog>
      </div>
    </div>
  );
};
export default OverviewPage;
