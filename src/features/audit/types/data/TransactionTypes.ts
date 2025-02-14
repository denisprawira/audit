import { IMetaData } from "@/types/network/Response";

export interface IItemTransactionData {
  busproc: string;
  doc_num: string;
  from: string;
  to: string;
  qty: number;
  doc_date: string;
  db: string;
  base_doc: string;
  cumulative_qty: number;
}

export interface IItemTransactionResponse {
  data: IItemTransactionData[];
  meta: IMetaData;
}

export interface Filters {
  from: string[];
  to: string[];
  busproc: string[];
}

export interface ITransactionResponse {
  transactions: IItemTransactionResponse;
  filters: Filters;
}
