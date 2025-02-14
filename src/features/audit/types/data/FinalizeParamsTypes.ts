import { IUser } from "@/types/UserTypes";

export interface IFinalizeReportParams {
  whs_code: string;
  db1: string;
  db2: string;
  cutoff_date: string;
  brand_codes: string[] | undefined;
}

export interface ICheckFinalizeParams {
  whscode: string;
  db1: string;
  db2: string;
  cutoff_date: string;
  brand_codes: string[] | undefined;
}

export interface ICheckFinalizeResponse {
  brand_codes: string[];
  cutoff_date: string;
  db1: string;
  db2: string;
  whscode: string;
  finalized_at: string;
  user: IUser;
}
