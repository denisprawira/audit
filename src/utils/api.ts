/* eslint-disable */
import api from "@/services/interceptor/Interceptor";
import { HttpMethod, QueryParams, UrlParams } from "@/types/network";
import {
  AxiosHeaders,
  AxiosProgressEvent,
  AxiosRequestConfig,
  AxiosResponse,
  ResponseType,
} from "axios";

export const callApi = (
  endpoint: string,
  method: HttpMethod,
  payload?: any | null,
  urlParams?: UrlParams | null,
  queryParams?: QueryParams | null,
  headers?: AxiosHeaders | any | null,
  responseType?: ResponseType | null,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<AxiosResponse<any>> => {
  let url = endpoint;

  // Replace placeholders in the URL with actual values from urlParams
  if (urlParams) {
    Object.keys(urlParams).forEach((param) => {
      const placeholder = `:${param}`;
      if (url.includes(placeholder)) {
        url = url.replace(placeholder, urlParams[param]);
      }
    });
  }
  // If no urlParams provided or there is urlParams not replaced, remove all placeholders
  url = url.replace(/\/:\w+/g, "");

  // Create the Axios request configuration
  const requestConfig: AxiosRequestConfig = {
    method,
    url,
    params: queryParams,
    headers, // Add headers to the request configuration
    onUploadProgress, // Add onUploadProgress to the request configuration
  };

  // Only include the payload if it's not null or undefined
  if (payload !== null && payload !== undefined) {
    requestConfig.data = payload;
  }

  if (responseType) {
    requestConfig.responseType = responseType;
  }

  return api(requestConfig);
};
