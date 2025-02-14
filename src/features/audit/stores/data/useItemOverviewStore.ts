import { IWarehouseOverviewData } from "@/features/audit/types/data/WarehouseTypes";
import { create } from "zustand";

interface IWarehouseOverviewDetail {
  warehouseOverviewData: IWarehouseOverviewData | undefined;
  setWarehouseOverviewData: (newParams: IWarehouseOverviewData) => void;
}

export const useWarehouseOverviewDetailData = create<IWarehouseOverviewDetail>(
  (set) => ({
    warehouseOverviewData: undefined,
    setWarehouseOverviewData: (newParams: IWarehouseOverviewData) =>
      set({ warehouseOverviewData: newParams }),
  }),
);
