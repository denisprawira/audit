import { create } from "zustand";

type ISheetStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const useSheetStore = create<ISheetStore>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
}));
