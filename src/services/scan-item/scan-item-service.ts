import { IErrorResponse, QueryParams } from "@/types/network";
import { callApi } from "@/utils/api";
import { endpoint } from "@/utils/endpoint";

export const getScanItem = async (scheduleID: string, params: QueryParams) => {
  try {
    const response = await callApi(
      endpoint.scan_item,
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

export const getScanItemDetail = async (
  scheduleID: string,
  scanId: string,
  params: QueryParams,
) => {
  try {
    const response = await callApi(
      endpoint.scan_item_detail,
      "GET",
      null,
      {
        scheduleID,
        scanId,
      },
      params,
    );
    return response;
    //eslint-disable-next-line
  } catch ({ response }: any) {
    throw response.data as IErrorResponse;
  }
};

export const getScanDownload = async (locationId: string) => {
  try {
    const response = await callApi(
      endpoint.download_scanned_item,
      "GET",
      null,
      {
        locationId,
      },
    );
    return response;
    //eslint-disable-next-line
  } catch ({ response }: any) {
    throw response.data as IErrorResponse;
  }
};
