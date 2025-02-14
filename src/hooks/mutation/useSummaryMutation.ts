import {
  createAdjustment,
  finalizeSummary,
} from "@/services/summary/summary-service";
import { QueryNames } from "@/utils/enumeration";
import { invalidateQuery } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export interface ISaveAdjustmentPayload {
  item_code: string;
  adjustment_type: string;
  adjustment_id?: string;
  reason?: string;
  description?: string;
  item_photo?: File;
  qty?: number;
  is_reviewed?: boolean;
}

export const useSummaryMutation = () => {
  const saveAdjustmentMutation = useMutation({
    mutationFn: async ({
      scheduleID,
      data,
    }: {
      scheduleID: string;
      data: ISaveAdjustmentPayload;
    }) => {
      const response = await createAdjustment(scheduleID, data);
      return response.data;
    },
    onSuccess: ({ message }, { data }) => {
      invalidateQuery(QueryNames.ADJUSTMENT);
      data.is_reviewed && invalidateQuery(QueryNames.SUMMARY);
      toast.success(message);
    },
    onError: ({ message }: { message: string }) => {
      toast.error(message);
    },
  });

  const finalizeSummaryMutation = useMutation({
    mutationFn: async (scheduleID: string) => {
      const response = await finalizeSummary(scheduleID);
      return response.data;
    },
    onSuccess: ({ message }) => {
      invalidateQuery(QueryNames.SUMMARY);
      invalidateQuery(QueryNames.SCHEDULE);
      toast.success(message);
    },
    onError: ({ message }: { message: string }) => {
      toast.error(message);
    },
  });

  return {
    saveAdjustmentMutation: saveAdjustmentMutation,
    finalizeSummary: finalizeSummaryMutation,
  };
};
