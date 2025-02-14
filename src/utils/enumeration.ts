export const Operators = {
  EQUAL: "=",
  NOT_EQUAL: "!=",
  LESS_THAN: "<",
  GREATER_THAN: ">",
  LESS_THAN_OR_EQUAL: "<=",
  GREATER_THAN_OR_EQUAL: ">=",
  IN: "in",
  NOT_IN: "not in",
};

export const WarehouseOverviewFilterNames = {
  ITEM_CODE: "item_code",
  BRAND_CODE: "brand_code",
  QTY_SOH: "qty_soh",
  QTY_SOH_1: "qty_soh_1",
  QTY_DIFFERENCE: "qty_difference",
  IS_REVIEWED: "is_reviewed",
};

export const ItemTransactionFilterNames = {
  BUS_PROC: "busproc",
  FROM: "from",
  TO: "to",
};

export enum Database {
  PSM = "PSM",
  BSMM = "BSMM",
  SKATE = "SKATE",
}

export enum QueryNames {
  USER_INFO = "user-info",
  WAREHOUSE_OVERVIEW = "warehouse-overview",
  ITEM_TRANSACTION = "item-transaction",
  ITEM_TRANSACTION_2 = "item-transaction-2",
  WAREHOUSE = "warehouse",
  BRANDS = "brands",
  DATABASES = "databases",
  CHECK_FINALIZE = "check-finalize",
  TRANSACTION_DOCUMENT = "transaction-document",
  TRANSACTION_DOCUMENT_REPORT = "transaction-document-report",
  FINALIZED_DOCUMENT_REPORT = "finalized-document-report",
  SCHEDULE = "schedule-query",
  SCHEDULE_OVERVIEW = "schedule-overview-query",
  FREEZE_ITEMS = "freeze-items",
  PULL_FREEZE_ITEMS = "pull-freeze-items",
  SELECT_DOCUMENT_FREEZE = "select-document-freeze",
  ASSIGNEES = "assignees-query",
  SCAN_ITEM = "scan-item",
  SCAN_ITEM_DETAILS = "scan-item-details",
  DOWNLOAD_SCAN_ITEM = "download-scan-item",
  SUMMARY = "summary",
  ADJUSTMENT = "adjustment",
  DOWNLAOD_COUNT_SUMMARY = "download-count-summary",
  DOWNLOAD_REPORT_SUMMARY = "download-report-summary",
  SUMMARY_REPORT_PREVIEW = "summary-report-preview",
  CHECK_FINALIZE_ELIGIBILITY = "check-finalize-eligibility",
}

export enum AdjustmentReason {
  Lost = "lost",
  LostFound = "lost_found",
  Forgotten = "forgotten",
  Other = "other",
  MultipleScans = "multiple_scans",
  StockSurplus = "stock_surplus",
}

export enum AdjustmentType {
  Plus = "plus",
  Minus = "minus",
  Equal = "equal",
}
export enum ScheduleType {
  SCHEDULED = "scheduled",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export enum ItemsType {
  SALE = "sale",
  NON_SALE = "non-sale",
}
