// userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  token: string | null;
  pseudo: string | null;
  avatar: string | null;
  email: string | null;
  money: number | null;
  isDarkMode: boolean;
}

const initialState: UserState = {
  token: null,
  pseudo: null,
  avatar: null,
  email: null,
  money: null,
  isDarkMode: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        token: string | null;
        pseudo: string | null;
        avatar: string | null;
        email: string | null;
        money: number | null;
        theme: boolean;
      }>,
    ) => {
      state.token = action.payload.token;
      state.pseudo = action.payload.pseudo;
      state.avatar = action.payload.avatar;
      state.email = action.payload.email;
      state.money = action.payload.money;
      state.isDarkMode = action.payload.theme;
    },

    updateMoney: (state, action: PayloadAction<number>) => {
      if (state.money !== null) {
        state.money = action.payload;
      }
    },

    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },

    setTheme: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },

    clearAuth: (state) => {
      state.token = null;
      state.pseudo = null;
      state.avatar = null;
      state.email = null;
      state.money = null;
    },
  },
});

export const { setAuth, updateMoney, toggleTheme, setTheme, clearAuth } =
  userSlice.actions;
export default userSlice.reducer;
