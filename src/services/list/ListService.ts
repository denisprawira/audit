import api from "@/services/interceptor/Interceptor";
import { IErrorResponse, ISuccessResponse } from "@/types/network/Response";
import { IBrandData, IDatabaseData } from "@/types/service/list";

class ListService {
  async getBrands() {
    try {
      const response = await api.get("/list/brand");
      return response.data as ISuccessResponse<IBrandData[]>;
      //eslint-disable-next-line
    } catch ({ response }: any) {
      throw response.data as IErrorResponse;
    }
  }

  async getComparisonDbs() {
    try {
      const response = await api.get("/list/available-db");
      return response.data as ISuccessResponse<IDatabaseData[]>;
      //eslint-disable-next-line
    } catch ({ response }: any) {
      throw response.data as IErrorResponse;
    }
  }
}
export default ListService;
