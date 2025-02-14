import { create } from "zustand";

interface IUIStateStore {
  overviewFetchingStatus: boolean;
  setOverviewFetchingStatus: (status: boolean) => void;
  allowFinalize: boolean;
  setAllowFinalize: (open: boolean) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  isFinalizeActive: boolean;
  setIsFinalizeActive: (open: boolean) => void;
  isHost: boolean;
  setHostStatus: (status: boolean) => void;
  showBottomFilters: boolean;
  setShowBottomFilters: (status: boolean) => void;
  hideSubmit: boolean;
  setHideSubmit: (hideSubmit: boolean) => void;
  resetOverviewSort: boolean;
  setResetOverviewSort: (resetOverviewSort: boolean) => void;
  isAllFinalized: boolean;
  setIsAllFinalized: (isAllFinalized: boolean) => void;
}

export const useUIStateStore = create<IUIStateStore>((set) => ({
  overviewFetchingStatus: false,
  setOverviewFetchingStatus: (overviewFetchingStatus) =>
    set({ overviewFetchingStatus }),
  allowFinalize: false,
  setAllowFinalize: (allowFinalize: boolean) => set({ allowFinalize }),
  open: false,
  setOpen: (open: boolean) => set({ open }),
  isFinalizeActive: false,
  setIsFinalizeActive: (isFinalizeActive: boolean) => set({ isFinalizeActive }),
  isHost: false,
  setHostStatus: (status) => set({ isHost: status }),
  showBottomFilters: false,
  setShowBottomFilters: (showBottomFilters) => set({ showBottomFilters }),
  hideSubmit: false,
  setHideSubmit: (hideSubmit) => set({ hideSubmit }),
  resetOverviewSort: false,
  setResetOverviewSort: (resetOverviewSort) => set({ resetOverviewSort }),
  isAllFinalized: false,
  setIsAllFinalized: (isAllFinalized) => set({ isAllFinalized }),
}));
