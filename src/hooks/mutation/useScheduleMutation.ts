import {
  createSchedule,
  deleteSchedule,
  updateSchedule,
} from "@/services/schedule/schedule-service";
import { QueryNames } from "@/utils/enumeration";
import { invalidateQuery } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export type ISchedulePayload = {
  id: string;
  store_code: string;
  start_date: string;
  end_date: string;
  assignees_id: string[];
};

const useScheduleMutation = () => {
  const navigate = useNavigate();
  const createScheduleMutation = useMutation({
    mutationKey: ["create-schedule-mutation"],
    mutationFn: async (payload: Omit<ISchedulePayload, "id">) => {
      const response = await createSchedule(payload);
      return response;
    },
    onSuccess: () => {
      invalidateQuery(QueryNames.SCHEDULE);
      invalidateQuery(QueryNames.SCHEDULE_OVERVIEW);
      toast.success("Schedule created successfully");
    },
    onError: ({ response }: AxiosError<{ message: string }>) => {
      response?.data.message && toast.error(response?.data.message);
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationKey: ["delete-schedule-mutation"],
    mutationFn: async (uuid: string) => {
      const response = await deleteSchedule(uuid);
      return response;
    },
    onSuccess: () => {
      navigate("/stock-opname/store");
      invalidateQuery(QueryNames.SCHEDULE);
      toast.success("Schedule deleted successfully");
    },
    onError: ({ response }: AxiosError<{ message: string }>) => {
      response?.data.message && toast.error(response?.data.message);
    },
  });
  const updateScheduleMutation = useMutation({
    mutationKey: ["update-schedule-mutation"],
    mutationFn: async (payload: Partial<ISchedulePayload> & { id: string }) => {
      const response = await updateSchedule(payload);
      return response;
    },
    onSuccess: () => {
      navigate("/stock-opname/store");
      invalidateQuery(QueryNames.SCHEDULE);
      toast.success("Schedule updated successfully");
    },
    onError: ({ response }: AxiosError<{ message: string }>) => {
      response?.data.message && toast.error(response?.data.message);
    },
  });

  return {
    createScheduleMutation,
    deleteScheduleMutation,
    updateScheduleMutation,
  };
};

export default useScheduleMutation;
