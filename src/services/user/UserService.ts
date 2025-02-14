import api from "@/services/interceptor/Interceptor";
import { IErrorResponse, ISuccessResponse } from "@/types/network/Response";
import { IUser } from "@/types/UserTypes";
import { callApi } from "@/utils/api";
import { endpoint } from "@/utils/endpoint";

const getUser = async () => {
  try {
    const response = await api.get("/user");
    return response.data as ISuccessResponse<IUser>;
    //eslint-disable-next-line
  } catch ({ response }: any) {
    throw response.data as IErrorResponse;
  }
};

const getUserList = async (role_codes: string[]) => {
  try {
    const response = await callApi(endpoint.user_list, "GET", null, null, {
      role_codes,
    });
    return response;
    //eslint-disable-next-line
  } catch ({ response }: any) {
    throw response.data as IErrorResponse;
  }
};

export { getUser, getUserList };
