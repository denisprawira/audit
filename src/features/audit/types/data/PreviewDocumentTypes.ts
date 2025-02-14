export interface IDocumentDetail {
  busproc: string;
  doc_num: string;
  remark: string;
  doc_date: string;
  base_doc: string | string[];
  qty_to: string;
  qty_from: string;
  company: string;
  created_at: string;
  updated_at: string;
}

export interface IDocumentTransaction {
  qty_total: number;
  itemcode: string;
}

export interface IDocument {
  detail: IDocumentDetail;
  transaction: IDocumentTransaction[];
}
