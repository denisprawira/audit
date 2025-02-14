/* eslint-disable */
export type QueryParams = Record<string, any>;
export type UrlParams = Record<string, string>;

export type Sort = "asc" | "desc" | "none";

export interface SortColumn {
  field: string;
  order: Sort;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
