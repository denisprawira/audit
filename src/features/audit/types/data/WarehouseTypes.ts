import { IUser } from "@/types/UserTypes";

export interface IWarehouseReview {
  id: string;
  remark: string;
  is_reviewed: boolean;
  is_changed: boolean;
  cutoff_from: string;
  cutoff_to: string;
  reviewer: IUser;
  updated_at: string;
}

export interface IWarehouseOverviewData {
  itemcode: string;
  qty_soh: number;
  qty_soh_1: number;
  qty_difference: number;
  brand_code: string;
  brand_name: string;
  is_finalized: boolean;
  review: IWarehouseReview | null | undefined;
}
