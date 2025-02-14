export interface ISuccessResponse<T> {
  message?: string;
  data: T;
  meta?: IMetaData;
}

export interface IMetaData {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface IErrorResponse {
  message: string;
  statusCode?: number;
}
