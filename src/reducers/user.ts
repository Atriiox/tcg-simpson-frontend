// store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  token: string | null;
  pseudo: string | null;
  monnaie: number | null;
  isDarkMode: boolean;
}

const initialState: UserState = {
  token: null,
  pseudo: null,
  monnaie: null,
  isDarkMode: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        token: string;
        pseudo: string;
        monnaie: number;
        theme: boolean;
      }>,
    ) => {
      state.token = action.payload.token;
      state.pseudo = action.payload.pseudo;
      state.monnaie = action.payload.monnaie;
      state.isDarkMode = action.payload.theme;
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
      state.monnaie = null;
    },
  },
});

export const { setAuth, toggleTheme, setTheme, clearAuth } = userSlice.actions;
export default userSlice.reducer;
