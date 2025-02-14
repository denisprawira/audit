import supabaseClient from "@/features/auth/utils/SupabaseClient";
import { IDocument } from "@/features/audit/types/data/PreviewDocumentTypes";
import { ITransactionResponse } from "@/features/audit/types/data/TransactionTypes";
import { IItemTransactionQueryParams } from "@/features/audit/types/filters/ItemTransactionFilters";
import api from "@/services/interceptor/Interceptor";
import { IErrorResponse, ISuccessResponse } from "@/types/network/Response";
import { downloadFile } from "@/utils/download";

class ItemTransactionService {
  async getItemTransaction({
    warehouseCode,
    filters,
  }: {
    warehouseCode: string;
    filters: IItemTransactionQueryParams;
  }) {
    try {
      const response = await api.get(
        `/warehouse/${warehouseCode}/transaction`,
        {
          params: { ...filters },
        },
      );
      return response.data as ITransactionResponse;
      //eslint-disable-next-line
    } catch ({ response }: any) {
      throw response.data as IErrorResponse;
    }
  }

  async getTransactionDocument({
    docnum,
    filters,
  }: {
    docnum: string;
    filters: { busproc: string; db: string };
  }) {
    try {
      const response = await api.get(
        `/warehouse/transaction/${docnum}/detail`,
        {
          params: { ...filters },
        },
      );
      return response.data as ISuccessResponse<IDocument>;
      //eslint-disable-next-line
    } catch ({ response }: any) {
      throw response.data as IErrorResponse;
    }
  }

  async getTransactionDocumentReport({
    docnum,
    filters,
  }: {
    docnum: string;
    filters: { busproc: string; db: string };
  }) {
    try {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Session token not available");
      }

      const response = await api.get(`/download/report/${docnum}/transaction`, {
        params: {
          ...filters,
          token: session?.access_token,
        },
        responseType: "arraybuffer",
      });

      const contentDisposition = response.headers["content-disposition"];
      const filename =
        contentDisposition?.split("filename=")[1]?.replace(/"/g, "") ||
        `report_${docnum}.xlsx`;

      downloadFile(
        response.data,
        filename,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      return response.data;
      //eslint-disable-next-line
    } catch ({ response }: any) {
      throw response.data as IErrorResponse;
    }
  }
}
export default ItemTransactionService;
