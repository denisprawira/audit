export interface Filter {
  field?: string;
  operator?: string;
  values?: string[] | boolean[] | number[];
}

export interface Sorts {
  qty_difference?: "asc" | "desc";
  brand_code?: "asc" | "desc";
  item_code?: "asc" | "desc";
  qty_soh?: "asc" | "desc";
  qty_soh_1?: "asc" | "desc";
}

export interface IWarehouseQueryParams {
  db1: string;
  db2: string;
  // perPage?: number;
  search?: string;
  // page?: number;
  filters?: Filter[];
  sorts?: Sorts;
  // cutoff_from?: string;
  cutoff_to: string;
}
