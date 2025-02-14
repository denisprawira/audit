import {
  Filter,
  IWarehouseQueryParams,
  Sorts,
} from "@/features/audit/types/filters/WarehouseOverviewFilters";
import { create } from "zustand";

interface WarehouseQueryStore {
  queryParams: IWarehouseQueryParams;

  // Individual setters
  setDb1: (db1: string) => void;
  setDb2: (db2: string) => void;
  setCutOffTo: (cutoff_to: string) => void;
  setPerPage: (perPage: number) => void;
  setSearch: (search: string) => void;

  // Filters management
  setFilters: (filters: Filter[]) => void;
  addFilter: (filter: Filter) => void;
  removeFilter: (fieldName: string) => void;

  // Sorts management
  setSorts: (sorts: Sorts) => void;

  // Reset methods
  resetFilters: () => void;
  resetSorts: () => void;
  reset: () => void;

  //warehouse or company
  company: string;
  setCompany: (company: string) => void;
}

const initialState: IWarehouseQueryParams = {
  db1: "",
  db2: "",
  cutoff_to: "",
};

export const useWarehouseOverviewFilters = create<WarehouseQueryStore>()(
  (set) => ({
    queryParams: { ...initialState },

    // Individual field setters
    setDb1: (db1) =>
      set((state) => ({
        queryParams: { ...state.queryParams, db1 },
      })),

    setDb2: (db2) =>
      set((state) => ({
        queryParams: { ...state.queryParams, db2 },
      })),

    setCutOffTo: (cutoff_to) =>
      set((state) => ({
        queryParams: { ...state.queryParams, cutoff_to },
      })),

    setPerPage: (perPage) =>
      set((state) => ({
        queryParams: { ...state.queryParams, perPage },
      })),

    setSearch: (search) =>
      set((state) => ({
        queryParams: { ...state.queryParams, search },
      })),

    // Filters management
    setFilters: (filters) =>
      set((state) => ({
        queryParams: {
          ...state.queryParams,
          filters: filters.length > 0 ? filters : undefined,
        },
      })),

    addFilter: (newFilter) =>
      set((state) => {
        const filters = state.queryParams.filters || [];
        const updatedFilters = filters.some(
          (filter: Filter) => filter.field === newFilter.field,
        )
          ? filters.map((filter: Filter) =>
              filter.field === newFilter.field ? newFilter : filter,
            )
          : [...filters, newFilter];

        return {
          queryParams: {
            ...state.queryParams,
            filters: updatedFilters.length ? updatedFilters : undefined,
          },
        };
      }),

    removeFilter: (fieldName) =>
      set((state) => {
        const updatedFilters = (state.queryParams.filters || []).filter(
          (filter: Filter) => filter.field !== fieldName,
        );
        return {
          queryParams: {
            ...state.queryParams,
            filters: updatedFilters.length ? updatedFilters : undefined,
          },
        };
      }),

    // Sorts management
    setSorts: (sorts) =>
      set((state) => ({
        queryParams: {
          ...state.queryParams,
          sorts: Object.keys(sorts).length ? sorts : undefined,
        },
      })),

    // Reset methods
    resetFilters: () =>
      set((state) => ({
        queryParams: { ...state.queryParams, filters: undefined },
      })),

    resetSorts: () =>
      set((state) => ({
        queryParams: { ...state.queryParams, sorts: undefined },
      })),

    reset: () => set(() => ({ queryParams: { ...initialState } })),

    company: "",
    setCompany: (company: string) => set({ company }),
  }),
);
