import { IItemTransactionQueryParams } from "@/features/audit/types/filters/ItemTransactionFilters";
import { create } from "zustand";

interface IItemTransactionFilters {
  queryParams: IItemTransactionQueryParams;
  updateQueryParams: (newParams: Partial<IItemTransactionQueryParams>) => void;
  removeFilter: (fieldName: string) => void;
}

const cleanParams = (params: Partial<IItemTransactionQueryParams>) => {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== "" && value !== null && value !== undefined,
    ),
  );
};

export const useItemTransactionFiltersA = create<IItemTransactionFilters>(
  (set) => ({
    queryParams: {
      itemcode: "",
      db: "",
      cutoff_to: "",
    },

    updateQueryParams: (newParams) =>
      set((state) => {
        const { filters: newFilters, ...otherParams } = newParams;
        const cleanedOtherParams = cleanParams(otherParams);
        const updatedFilters = [...(state.queryParams.filters || [])];
        if (newFilters) {
          newFilters.forEach((newFilter) => {
            const existingFilterIndex = updatedFilters.findIndex(
              (filter) => filter.field === newFilter.field,
            );
            if (existingFilterIndex !== -1) {
              updatedFilters[existingFilterIndex] = newFilter;
            } else {
              updatedFilters.push(newFilter);
            }
          });
        }

        Object.keys(newParams).forEach((key) => {
          const typedKey = key as keyof Partial<IItemTransactionQueryParams>;
          if (
            newParams[typedKey] === undefined ||
            newParams[typedKey] === null ||
            newParams[typedKey] === "" ||
            (typeof newParams[typedKey] === "object" &&
              newParams[typedKey] !== null &&
              Object.keys(newParams[typedKey]).length === 0)
          ) {
            delete state.queryParams[typedKey];
            delete cleanedOtherParams[typedKey];
          }
        });

        const queryParams = {
          ...state.queryParams,
          ...cleanedOtherParams,
          ...(updatedFilters.length > 0 ? { filters: updatedFilters } : {}),
        };

        if (
          updatedFilters.length === 0 ||
          updatedFilters.every(
            (filter) =>
              filter === undefined ||
              filter === null ||
              (typeof filter === "object" && Object.keys(filter).length === 0),
          )
        ) {
          delete queryParams.filters;
        }

        return {
          queryParams,
        };
      }),
    removeFilter: (fieldName: string) =>
      set((state) => {
        const updatedFilters =
          state.queryParams.filters?.filter(
            (filter) => filter.field !== fieldName,
          ) || [];
        const newQueryParams = {
          ...state.queryParams,
        };
        if (updatedFilters.length > 0) {
          newQueryParams.filters = updatedFilters;
        } else {
          delete newQueryParams.filters;
        }
        return { queryParams: newQueryParams };
      }),
  }),
);

export const useItemTransactionFiltersB = create<IItemTransactionFilters>(
  (set) => ({
    queryParams: {
      itemcode: "",
      db: "",
      cutoff_to: "",
    },

    updateQueryParams: (newParams) =>
      set((state) => {
        const { filters: newFilters, ...otherParams } = newParams;
        const cleanedOtherParams = cleanParams(otherParams);
        const updatedFilters = [...(state.queryParams.filters || [])];
        if (newFilters) {
          newFilters.forEach((newFilter) => {
            const existingFilterIndex = updatedFilters.findIndex(
              (filter) => filter.field === newFilter.field,
            );
            if (existingFilterIndex !== -1) {
              updatedFilters[existingFilterIndex] = newFilter;
            } else {
              updatedFilters.push(newFilter);
            }
          });
        }

        Object.keys(newParams).forEach((key) => {
          const typedKey = key as keyof Partial<IItemTransactionQueryParams>;
          if (
            newParams[typedKey] === undefined ||
            newParams[typedKey] === null ||
            newParams[typedKey] === "" ||
            (typeof newParams[typedKey] === "object" &&
              newParams[typedKey] !== null &&
              Object.keys(newParams[typedKey]).length === 0)
          ) {
            delete state.queryParams[typedKey];
            delete cleanedOtherParams[typedKey];
          }
        });

        const queryParams = {
          ...state.queryParams,
          ...cleanedOtherParams,
          ...(updatedFilters.length > 0 ? { filters: updatedFilters } : {}),
        };

        if (
          updatedFilters.length === 0 ||
          updatedFilters.every(
            (filter) =>
              filter === undefined ||
              filter === null ||
              (typeof filter === "object" && Object.keys(filter).length === 0),
          )
        ) {
          delete queryParams.filters;
        }

        return {
          queryParams,
        };
      }),
    removeFilter: (fieldName: string) =>
      set((state) => {
        const updatedFilters =
          state.queryParams.filters?.filter(
            (filter) => filter.field !== fieldName,
          ) || [];
        const newQueryParams = {
          ...state.queryParams,
        };
        if (updatedFilters.length > 0) {
          newQueryParams.filters = updatedFilters;
        } else {
          delete newQueryParams.filters;
        }
        return { queryParams: newQueryParams };
      }),
  }),
);
