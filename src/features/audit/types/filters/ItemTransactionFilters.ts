export interface IItemTransactionQueryParams {
  itemcode: string;
  db: string;
  cutoff_from?: string;
  cutoff_to: string;
  sorts?: IItemSorts;
  filters?: IFilter[];
  page?: number;
}

export interface IFilter {
  field?: string;
  operator?: string;
  values?: string[] | boolean | string | number;
}

export interface IItemSorts {
  busproc?: SortOrder;
  doc_num?: SortOrder;
  qty_from?: SortOrder;
  qty_to?: SortOrder;
  qty_total?: SortOrder;
  doc_date?: SortOrder;
  db?: SortOrder;
  base_doc?: SortOrder;
  cumulative_qty?: SortOrder;
}

type SortOrder = "asc" | "desc";
