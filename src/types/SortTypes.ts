export interface SortColumn {
  field: string;
  order: Sort;
}

export type Sort = "none" | "asc" | "desc";
