import { IUser } from "@/types/UserTypes";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type IUserStore = {
  user: IUser | undefined;
  setUser: (user: IUser) => void;
};

export const useUserStore = create(
  persist<IUserStore>(
    (set) => ({
      user: undefined,
      setUser: (user: IUser) => set({ user }),
    }),
    {
      name: "user",
    },
  ),
);
