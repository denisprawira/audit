import { Button } from "@/components/ui/button";
import Filters from "@/features/stock-opname/store/components/filters";
import ScheduleModal from "@/features/stock-opname/store/components/schedule-modal";
import DefaultTable from "@/components/default-table/default-table";
import { useColdefSoStore } from "@/features/stock-opname/store/utils/coldef";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { IScheduleData } from "@/types/data";
import { useFetchWarehouses } from "@/hooks/query/useFetchWarehouses";
import useScheduleMutation from "@/hooks/mutation/useScheduleMutation";
import useSchedule from "@/hooks/query/stock-opname/useSchedule";

const SoStorePage = () => {
  const navigate = useNavigate();
  const scheduleHook = useSchedule({ roleCode: ["SO"] });
  const { schedule, scheduleQuery } = scheduleHook;
  const warehouseQuery = useFetchWarehouses({ types: ["PS"], isActive: true });
  const scheduleMutation = useScheduleMutation();
  const coldef = useColdefSoStore();

  return (
    <div className="flex flex-col max-h-[calc(100vh-4.125rem)] h-full w-full gap-4 max-sm:px-6 px-6 py-6 overflow-x-auto w-full">
      <div className="h-fit flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1
            className="text-lg font-semibold"
            onClick={() => navigate("/stock-opname/store/detail")}
          >
            Store
          </h1>
          <ScheduleModal
            scheduleHook={scheduleHook}
            warehouseHook={warehouseQuery}
            mutationHook={scheduleMutation}
          >
            <Button>
              <Plus />
              {"Add Schedule"}
            </Button>
          </ScheduleModal>
        </div>
        <div className="flex justify-between flex-wrap gap-y-4">
          <Filters
            setSearch={schedule.setSearch}
            setStartDate={schedule.setStartDate}
            setEndDate={schedule.setEndDate}
            setStatus={schedule.setStatus}
          />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <DefaultTable<IScheduleData>
          setSorting={schedule.setSorting}
          sorting={schedule.sorting}
          coldef={coldef}
          data={scheduleQuery.data?.data ?? []}
          isLoading={scheduleQuery.isLoading}
          isFetching={scheduleQuery.isFetching}
          page={scheduleQuery.data?.meta?.current_page ?? 1}
          totalPage={scheduleQuery.data?.meta?.total}
          setPage={schedule.setPage}
        />
      </div>
    </div>
  );
};

export default SoStorePage;
