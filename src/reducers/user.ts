// userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  token: string | null;
  pseudo: string | null;
  avatar: string | null;
  email: string | null;
  money: number | null;
  countdownEnds: Date | null;
  isDarkMode: boolean;
}

const initialState: UserState = {
  token: null,
  pseudo: null,
  avatar: null,
  email: null,
  money: null,
  countdownEnds: null,
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
        countdownEnds: Date | null;
        theme: boolean;
      }>,
    ) => {
      state.token = action.payload.token;
      state.pseudo = action.payload.pseudo;
      state.avatar = action.payload.avatar;
      state.email = action.payload.email;
      state.money = action.payload.money;
      state.countdownEnds = action.payload.countdownEnds;
      state.isDarkMode = action.payload.theme;
    },

    updateMoney: (state, action: PayloadAction<number>) => {
      if (state.money !== null) {
        state.money = action.payload;
      }
    },

    updateCountdownEnds: (state, action: PayloadAction<Date>) => {
      if (state.countdownEnds !== null) {
        state.countdownEnds = action.payload;
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
      state.countdownEnds = null;
    },
  },
});

export const { setAuth, updateMoney, toggleTheme, setTheme, clearAuth } =
  userSlice.actions;
export default userSlice.reducer;
