import { StateCreator } from "zustand";
import {TPayload} from "@/types";



type TUserStore = {
  user: TPayload | null
  isAuth: boolean;
  setUser: (user: TPayload) => void;
  setAuth: (auth: boolean) => void;
  clearUser: () => void;
};

const userSlice: StateCreator<TUserStore> = (set, get) => ({
  user: null,
  isAuth: false,
  setAuth: (auth) =>
    set((state) => ({
      ...state,
      isAuth: auth,
    })),
  setUser: (user) =>
    set((state) => ({
      ...state,
      user: {
        ...user,
      },
        isAuth:true
    })),
    clearUser: () => set((state) => ({ ...state, user: null, isAuth: false })),

});

export { userSlice };
export type { TUserStore };