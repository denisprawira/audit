import {
  IReviewBodyParams,
  IReviewResponse,
} from "@/features/audit/types/data/ReviewTypes";
import api from "@/services/interceptor/Interceptor";

class ReviewService {
  async addReview(
    brands: string[],
    data: IReviewBodyParams,
  ): Promise<IReviewResponse> {
    try {
      const params = brands.map((brand, index) => [
        `brand_codes[${index}]`,
        brand,
      ]);
      const queryString = new URLSearchParams(params).toString();

      const response = await api.post(
        `/review${queryString && `?${queryString}`}`,
        data,
      );
      return response.data as IReviewResponse;
      //eslint-disable-next-line
    } catch ({ response }: any) {
      throw response.data as { message: string };
    }
  }
}
export default ReviewService;
