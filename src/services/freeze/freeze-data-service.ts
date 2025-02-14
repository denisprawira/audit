import { IErrorResponse, QueryParams } from "@/types/network";
import { callApi } from "@/utils/api";
import { endpoint } from "@/utils/endpoint";

export const pullFreezeData = async (scheduleID: string, freezeId: string) => {
  try {
    const result = await callApi(
      endpoint.pull_freeze_data,
      "GET",
      null,
      {
        scheduleID,
      },
      {
        id: freezeId,
      },
    );
    return result;
    //eslint-disable-next-line
  } catch ({ response }: any) {
    throw response.data as IErrorResponse;
  }
};

export const getFreezeData = async (
  scheduleID: string,
  params: QueryParams,
) => {
  try {
    const result = await callApi(
      endpoint.freeze_data,
      "GET",
      null,
      {
        scheduleID,
      },
      params,
    );
    return result;
    //eslint-disable-next-line
  } catch ({ response }: any) {
    throw response.data as IErrorResponse;
  }
};

export const getAvailableFreezeData = async (scheduleID: string) => {
  try {
    const result = await callApi(endpoint.available_freeze_data, "GET", null, {
      scheduleID,
    });
    return result;
    //eslint-disable-next-line
  } catch ({ response }: any) {
    throw response.data as IErrorResponse;
  }
};
