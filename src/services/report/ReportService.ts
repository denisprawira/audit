import {
  ICheckFinalizeParams,
  ICheckFinalizeResponse,
  IFinalizeReportParams,
} from "@/features/audit/types/data/FinalizeParamsTypes";
import api from "@/services/interceptor/Interceptor";
import { IErrorResponse, ISuccessResponse } from "@/types/network/Response";
import { AxiosError } from "axios";
class ReportService {
  async finalizeReport(params: IFinalizeReportParams) {
    try {
      const response = await api.post("/report/finalize", { ...params });
      return response;
      //eslint-disable-next-line
    } catch ({ response }: any) {
      throw response.data as IErrorResponse;
    }
  }

  async checkFinalize(params: ICheckFinalizeParams) {
    try {
      const response = await api.get("/report/finalize", {
        params: { ...params },
      });
      return response.data as ISuccessResponse<ICheckFinalizeResponse[]>;
      //eslint-disable-next-line
    } catch (error: any) {
      throw error as AxiosError;
    }
  }
}
export default ReportService;
