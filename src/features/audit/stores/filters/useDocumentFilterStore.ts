import { create } from "zustand";

type Filters = { busproc: string; db: string; docnum: string };

interface IDocumentFilters {
  filters: Filters | undefined;
  setFilters: (filters: Filters | undefined) => void;
}

export const useDocumentFiltersStore = create<IDocumentFilters>((set) => ({
  filters: undefined,
  setFilters: (filters) => set({ filters }),
}));
