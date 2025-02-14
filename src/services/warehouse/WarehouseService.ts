import supabaseClient from "@/features/auth/utils/SupabaseClient";
import { IWarehouseOverviewData } from "@/features/audit/types/data/WarehouseTypes";
import { IWarehouseQueryParams } from "@/features/audit/types/filters/WarehouseOverviewFilters";
import api from "@/services/interceptor/Interceptor";
import { IErrorResponse, ISuccessResponse } from "@/types/network/Response";
import { IWarehouseData } from "@/types/service/warehouse";
import { downloadFile } from "@/utils/download";
import { callApi } from "@/utils/api";
import { endpoint } from "@/utils/endpoint";

class WarehouseService {
  async getWarehouses(types?: string[], is_active?: boolean) {
    try {
      const response = await callApi(endpoint.warehouse, "GET", null, null, {
        types,
        is_active: is_active,
      });
      return response.data as ISuccessResponse<IWarehouseData[]>;
      //eslint-disable-next-line
    } catch ({ response }: any) {
      throw response.data as IErrorResponse;
    }
  }

  async getWarehouseOverview({
    warehouseCode,
    filters,
  }: {
    warehouseCode: string;
    filters: IWarehouseQueryParams;
  }) {
    try {
      const response = await api.get(`/warehouse/${warehouseCode}/overview`, {
        params: { ...filters },
      });
      return response.data as ISuccessResponse<IWarehouseOverviewData[]> & {
        allow_finalize: boolean;
      };
      //eslint-disable-next-line
    } catch ({ response }: any) {
      throw response.data as IErrorResponse;
    }
  }

  async getFinalizeDocumentReport({
    whscode,
    filters,
  }: {
    whscode: string;
    filters: {
      db1: string;
      db2: string;
      cutoff_date: string;
      brand_codes: string[];
    };
  }) {
    try {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Session token not available");
      }

      const params = {
        db1: filters.db1,
        db2: filters.db2,
        cutoff_date: filters.cutoff_date,
      };

      const brandCodesParams = filters.brand_codes.reduce<
        Record<string, string>
      >((acc, code, index) => {
        acc[`brand_codes[${index}]`] = code; // Dynamically add indexed keys
        return acc;
      }, {});

      // Ensure token is added last
      const serializedParams = {
        ...params,
        ...brandCodesParams,
        token: session?.access_token, // Append token after brand_codes
      };

      const response = await api.get(
        `/download/${whscode}/finalized-overview-report`,
        {
          params: serializedParams,
          responseType: "arraybuffer",
        },
      );

      const contentDisposition = response.headers["content-disposition"];
      const filename =
        contentDisposition?.split("filename=")[1]?.replace(/"/g, "") ||
        `report_${whscode}.xlsx`;

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
export default WarehouseService;
