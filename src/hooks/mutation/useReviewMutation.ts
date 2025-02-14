import { invalidateWarehouseOverview } from "@/hooks/query/useWarehouseOverviewQueries";
import { useWarehouseOverviewDetailData } from "@/features/audit/stores/data/useItemOverviewStore";
import {
  IReviewBodyParams,
  IReviewResponse,
} from "@/features/audit/types/data/ReviewTypes";
import {
  IWarehouseOverviewData,
  IWarehouseReview,
} from "@/features/audit/types/data/WarehouseTypes";
import ReviewService from "@/services/review/ReviewService";
import { IUser } from "@/types/UserTypes";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const reviewService = new ReviewService();

export const useReviewMutation = () => {
  const { warehouseOverviewData, setWarehouseOverviewData } =
    useWarehouseOverviewDetailData();

  const query = useMutation<
    IReviewResponse,
    { message: string },
    IReviewBodyParams
  >({
    mutationFn: async (data: IReviewBodyParams) => {
      const { brand_codes, ...rest } = data;
      const response = await reviewService.addReview(brand_codes || [], rest);
      return response as IReviewResponse;
    },

    onSuccess: (data: IReviewResponse) => {
      setWarehouseOverviewData({
        ...(useWarehouseOverviewDetailData.getState()
          .warehouseOverviewData as IWarehouseOverviewData),
        review: {
          ...(warehouseOverviewData?.review as IWarehouseReview),
          is_reviewed: data.is_reviewed,
          remark: data.remark,
          reviewer: data.reviewer as IUser,
          updated_at: data.updated_at,
        },
      });
      invalidateWarehouseOverview();
      toast.dismiss();
      toast.success("Success");
    },
    onError: ({ message }: { message: string }) => {
      toast.error(message);
    },
  });

  return query;
};
