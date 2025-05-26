import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { TUserStore, userSlice } from "./slice";

export const useUserStore = create<TUserStore>()(
  persist(
    devtools((...a) => ({
      ...userSlice(...a),
    })),
    {
      name: "user",
    },
  ),
);