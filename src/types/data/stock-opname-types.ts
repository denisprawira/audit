export type Assignee = {
  id: string;
  name: string;
  email: string;
  employee_id: string;
};

export type User = {
  id: string;
  name: string;
  is_active: boolean;
  employee_id: string | null;
};

export interface IScheduleData {
  id: string;
  store_code: string;
  store_city: string;
  start_date: string;
  end_date: string;
  status: string;
  finalize_data: {
    created_at: string;
    user: Assignee;
  };
  total_qty: number;
  assignees: Assignee[];
}

export type FreezeGroup = {
  id: string;
  created_at: string;
  total_qty: number;
  total_amount: number;
  user: User;
};

export type ISummaryFinalizeData = {
  created_at: string;
  user: {
    id: string;
    name: string;
    email: string;
    employee_id: string | null;
  };
};

export interface IScheduleOverviewData {
  id: string;
  store_code: string;
  start_date: string;
  end_date: string;
  status: string;
  is_finalized: boolean;
  total_qty: number;
  assignees: Assignee[];
  area_manager: string;
  senior_store_head: string;
  week: number;
  freeze_group: FreezeGroup;
}

export interface IFreezeData {
  amount_price: number;
  barcode: string;
  brand_code: string;
  description: string;
  item_code: string;
  per_item_price: number;
  qty: number;
}

export interface IDocumentFreeze {
  id: number;
  total_items: number;
  doctype: string;
  freezedate: string;
  store: { code: string; city: string };
}

export interface IScanData {
  id: string;
  background_image: string;
  user: Assignee;
  name: string;
  total_qty: number;
}

export interface IScanItemDetail {
  barcode: string;
  qty: number;
  brand_code: string;
  item_code: string;
  per_item_price: number;
  amount: number;
}

export interface ICommentData {
  comment: string;
  comment_image: string;
  scanned_at: string;
  user: Assignee;
}

export interface ISummaryData {
  location_name: string;
  brand_code: string;
  item_code: string;
  freeze_qty: number;
  freeze_amount: number;
  scan_qty: number;
  scan_amount: number;
  difference: number;
  difference_amount: number;
  status: string;
  is_reviewed: boolean;
}

export interface ISummaryAdjustmentData {
  id: string;
  is_reviewed: boolean;
  reviewer: Assignee;
  adjustments: Adjustment[];
  total_adjustments: number;
  total_qty: number;
}
export type Adjustment = {
  id: string;
  reason: string;
  qty: number;
  description: string;
  item_photo: string;
  user: Assignee;
  adjustment_type: string;
};

export interface IPreviewReportScheduleDetail {
  id: string;
  store_code: string;
  store_city: string;
  start_date: string;
  end_date: string;
  status: string;
  finalize_data: {
    created_at: string;
    user: Assignee;
  };
  total_qty: number;
  assignees: Assignee[];
  area_manager: string;
  senior_store_head: string;
  week: number;
  freeze_group: FreezeGroup;
}

export interface IPreviewSummaryReportData {
  brand_code: string;
  freeze_qty: number;
  freeze_amount: number;
  scan_qty: number;
  scan_amount: number;
  difference: number;
  difference_amount: number;
}

export interface IPreviewReportTotals {
  freeze_qty: number;
  freeze_amount: number;
  scan_qty: number;
  scan_amount: number;
  difference: number;
  difference_amount: number;
}
