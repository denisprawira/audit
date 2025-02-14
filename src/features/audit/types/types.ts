export interface IStoreReport {
  itemCode: string;
  brand: string;
  difference: number;
  reviewed: boolean;
  remark: string;
  [key: string]: number | string | boolean;
}

export interface IItemTransactionData {
  busproc: string;
  doc_num: string;
  qty_from: string;
  qty_to: string;
  qty_total: number;
  doc_date: string;
  cumulative_qty: number;
  base_doc: string;
}
