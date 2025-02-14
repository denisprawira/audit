import {
  ICheckFinalizeParams,
  ICheckFinalizeResponse,
} from "@/features/audit/types/data/FinalizeParamsTypes";
import ReportService from "@/services/report/ReportService";
import { ISuccessResponse } from "@/types/network/Response";
import { QueryNames } from "@/utils/enumeration";
import { queryClient } from "@/utils/query-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const reportService = new ReportService();

export const useCheckFinalize = (params: ICheckFinalizeParams) =>
  //eslint-disable-next-line
  useQuery<{}, AxiosError, ISuccessResponse<ICheckFinalizeResponse[]>>({
    queryKey: [
      QueryNames.CHECK_FINALIZE,
      params.whscode,
      params.db1,
      params.db2,
      params.cutoff_date,
      params.brand_codes,
    ],
    queryFn: async () => {
      const response = await reportService.checkFinalize(params);
      return response;
    },
    enabled:
      !!params.whscode && !!params.db1 && !!params.db2 && !!params.cutoff_date,
    retry: (failureCount, error) => {
      if (error?.response?.status === 404) {
        return false;
      }

      return failureCount < 3;
    },
  });

export const invalidateCheckFinalizeQuery = () => {
  queryClient.invalidateQueries({
    queryKey: [QueryNames.CHECK_FINALIZE],
  });
};
