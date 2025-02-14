import { create } from "zustand";
import { type RefObject } from "react";

// Define possible ref keys to ensure type safety
export type RefKey =
  | "pagination"
  | "header"
  | "toolbar"
  | "detailToolbar"
  | "remarkDetail";

type ElementRefs = {
  refs: {
    [K in RefKey]?: RefObject<HTMLElement> | null;
  };
  setRef: (key: RefKey, ref: RefObject<HTMLElement> | null) => void;
  getRef: (key: RefKey) => RefObject<HTMLElement> | null | undefined;
  clearRef: (key: RefKey) => void;
  clearAllRefs: () => void;
};

export const useElementRefs = create<ElementRefs>((set, get) => ({
  refs: {},

  setRef: (key, ref) => {
    set((state) => ({
      refs: {
        ...state.refs,
        [key]: ref,
      },
    }));
  },

  getRef: (key) => {
    return get().refs[key];
  },

  clearRef: (key) => {
    set((state) => {
      const newRefs = { ...state.refs };
      delete newRefs[key];
      return { refs: newRefs };
    });
  },

  clearAllRefs: () => {
    set({ refs: {} });
  },
}));
