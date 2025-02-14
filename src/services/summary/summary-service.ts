import { ISaveAdjustmentPayload } from "@/hooks/mutation/useSummaryMutation";
import api from "@/services/interceptor/Interceptor";
import { IErrorResponse, QueryParams } from "@/types/network";
import { callApi } from "@/utils/api";
import { downloadFile } from "@/utils/download";
import { endpoint } from "@/utils/endpoint";

export const getSummary = async (scheduleID: string, params?: QueryParams) => {
  try {
    const response = await callApi(
      endpoint.summary,
      "GET",
      null,
      {
        scheduleID,
      },
      params,
    );
    return response;
    //eslint-disable-next-line
  } catch ({ response }: any) {
    throw response.data as IErrorResponse;
  }
};

export const getAdjustment = async (
  scheduleID: string,
  itemCode: string,
  params?: QueryParams,
) => {
  try {
    const response = await callApi(
      endpoint.adjustment,
      "GET",
      null,
      {
        scheduleID,
        itemCode,
      },
      params,
    );
    return response;
    //eslint-disable-next-line
  } catch ({ response }: any) {
    throw response.data as IErrorResponse;
  }
};

export const createAdjustment = async (
  scheduleID: string,
  payload: ISaveAdjustmentPayload,
) => {
  try {
    const formData = new FormData();
    formData.append("item_code", payload.item_code);
    formData.append("adjustment_type", payload.adjustment_type);
    payload.adjustment_id &&
      formData.append("adjustment_id", payload.adjustment_id);
    payload.reason && formData.append("reason", payload.reason);
    payload.description && formData.append("description", payload.description);
    payload.qty && formData.append("qty", payload.qty.toString());
    payload.is_reviewed &&
      formData.append("is_reviewed", payload.is_reviewed.toString());
    payload.item_photo && formData.append("item_photo", payload.item_photo);
    const response = await callApi(
      endpoint.save_adjustment,
      "POST",
      formData,
      {
        scheduleID,
      },
      null,
      {
        "Content-Type": "multipart/form-data",
      },
    );
    return response;
    //eslint-disable-next-line
  } catch ({ response }: any) {
    throw response.data as IErrorResponse;
  }
};

export const finalizeSummary = async (scheduleID: string) => {
  try {
    const response = await callApi(endpoint.finalize_summary, "POST", null, {
      scheduleID,
    });
    return response;
    //eslint-disable-next-line
  } catch ({ response }: any) {
    throw response.data as IErrorResponse;
  }
};

export const getSummarypreviewReport = async (scheduleID: string) => {
  try {
    const response = await callApi(
      endpoint.summary_report_preview,
      "GET",
      null,
      {
        scheduleID,
      },
    );
    return response;
    //eslint-disable-next-line
  } catch ({ response }: any) {
    throw response.data as IErrorResponse;
  }
};

export const getSummaryCountDocument = async (scheduleId: string) => {
  try {
    const response = await callApi(
      endpoint.download_summary_count,
      "GET",
      null,
      {
        scheduleId,
      },
    );
    return response;
    //eslint-disable-next-line
  } catch ({ response }: any) {
    throw response.data as IErrorResponse;
  }
};

export const getSummaryReportDocument = async (
  scheduleId: string,
  queryParams: QueryParams,
) => {
  try {
    const response = await api.get(
      `/download/stock-opname/report/${scheduleId}/summary`,
      {
        headers: {
          Accept: "application/pdf",
        },
        responseType: "blob",
        params: {
          ...queryParams,
        },
      },
    );

    downloadFile(response.data, "report.pdf", "application/pdf");
    return response;
    //eslint-disable-next-line
  } catch ({ response }: any) {
    throw response.data as IErrorResponse;
  }
};

export const checkFinalizeEligibility = async (scheduleID: string) => {
  try {
    const response = await callApi(
      endpoint.checkFinalize_eligible,
      "GET",
      null,
      {
        scheduleID,
      },
    );
    return response;
    //eslint-disable-next-line
  } catch ({ response }: any) {
    throw response.data as IErrorResponse;
  }
};
