import { IReviewBodyParams } from "@/features/audit/types/data/ReviewTypes";
import { create } from "zustand";

interface IReviewStore {
  reviewStoreMutation: IReviewBodyParams | undefined;
  setReviewStoreMutation: (newParams: IReviewBodyParams) => void;
}

export const useReviewStoreMutation = create<IReviewStore>((set) => ({
  reviewStoreMutation: undefined,
  setReviewStoreMutation: (newParams: IReviewBodyParams) =>
    set({ reviewStoreMutation: newParams }),
}));
