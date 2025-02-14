import { invalidateCheckFinalizeQuery } from "@/hooks/query/useCheckFinalize";
import { invalidateWarehouseOverview } from "@/hooks/query/useWarehouseOverviewQueries";
import { IFinalizeReportParams } from "@/features/audit/types/data/FinalizeParamsTypes";
import ReportService from "@/services/report/ReportService";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const reportService = new ReportService();

export const useFinalizeReport = () =>
  useMutation({
    mutationFn: async (data: IFinalizeReportParams) => {
      const response = await reportService.finalizeReport(data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Report finalized successfully");
      invalidateCheckFinalizeQuery();
      invalidateWarehouseOverview();
    },
    onError: ({ message }: { message: string }) => {
      toast.error(message);
    },
  });
