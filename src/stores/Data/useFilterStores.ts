import { Assignee } from "@/types/data";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface IFitlers {
  scannedBy: Assignee[];
  setScannedBy: (scannedBy: Assignee[]) => void;
  scheduleID: string;
  setScheduleID: (scheduleID: string) => void;
  scanId: string;
  setScanId: (scheduleID: string) => void;
  storeCode: string;
  setStoreCode: (storeCode: string) => void;
  adjustmentFilters: {
    itemCode: string;
    brand: string;
    qtyDifference: number;
    isReview: boolean;
    status: string;
  };
  setAdjustmentFilters: (adjustmentFilters: {
    itemCode: string;
    brand: string;
    qtyDifference: number;
    isReview: boolean;
    status: string;
  }) => void;
}

export const useFilters = create<IFitlers>()(
  persist(
    (set) => ({
      scannedBy: [],
      setScannedBy: (scannedBy: Assignee[]) => set({ scannedBy }),
      scheduleID: "",
      setScheduleID: (scheduleID: string) => set({ scheduleID: scheduleID }),
      scanId: "",
      setScanId: (scheduleID: string) => set({ scanId: scheduleID }),
      storeCode: "",
      setStoreCode: (storeCode: string) => set({ storeCode }),
      adjustmentFilters: {
        itemCode: "",
        brand: "",
        isReview: false,
        qtyDifference: 0,
        status: "",
      },
      setAdjustmentFilters: (adjustmentFilters) => set({ adjustmentFilters }),
    }),
    {
      name: "filters-storage", // Storage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        scheduleID: state.scheduleID,
        scannedBy: state.scannedBy,
        scanId: state.scanId,
        storeCode: state.storeCode,
        adjustmentFilters: state.adjustmentFilters,
      }), // Persist only overviewStoreId
    },
  ),
);
