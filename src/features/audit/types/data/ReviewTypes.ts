import { IUser } from "@/types/UserTypes";

export interface IReviewBodyParams {
  itemcode: string;
  whscode: string;
  db1: string;
  db2: string;
  cutoff_date: string;
  is_reviewed?: boolean;
  remark?: string;
  reviewer?: IUser;
  qty_soh?: number;
  qty_soh_1?: number;
  qty_difference?: number;
  brand_code?: string;
  brand_codes?: string[];
}

export interface IReviewResponse {
  id: string;
  remark: string;
  is_reviewed: boolean;
  cutoff_date: string;
  created_at: string;
  updated_at: string;
  qty_soh: number;
  qty_soh_1: number;
  qty_difference: number;
  reviewer?: IUser;
}
