import { ISchedulePayload } from "@/hooks/mutation/useScheduleMutation";
import { IErrorResponse, QueryParams } from "@/types/network";
import { callApi } from "@/utils/api";
import { endpoint } from "@/utils/endpoint";

const getSchedule = async function (params: QueryParams) {
  try {
    const result = callApi(endpoint.so_schedule, "GET", null, null, params);
    return result;
    //eslint-disable-next-line
  } catch ({ response }: any) {
    throw response.data as IErrorResponse;
  }
};

const getScheduleDetail = async function (uuid: string) {
  try {
    const result = await callApi(`${endpoint.so_schedule}/:uuid`, "GET", null, {
      uuid,
    });
    return result;
    //eslint-disable-next-line
  } catch ({ response }: any) {
    throw response.data as IErrorResponse;
  }
};

const createSchedule = async function (payload: Omit<ISchedulePayload, "id">) {
  try {
    const result = callApi(endpoint.so_schedule, "POST", payload);
    return result;
    //eslint-disable-next-line
  } catch ({ response }: any) {
    throw response.data as IErrorResponse;
  }
};

const updateSchedule = async function (
  payload: Partial<ISchedulePayload> & { id: string },
) {
  try {
    const result = callApi(endpoint.so_schedule, "PUT", payload);
    return result;
    //eslint-disable-next-line
  } catch ({ response }: any) {
    throw response.data as IErrorResponse;
  }
};

const deleteSchedule = async function (uuid: string) {
  try {
    const result = callApi(`${endpoint.so_schedule}/:uuid`, "POST", null, {
      uuid,
    });
    return result;
    //eslint-disable-next-line
  } catch ({ response }: any) {
    throw response.data as IErrorResponse;
  }
};

export {
  getSchedule,
  getScheduleDetail,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
