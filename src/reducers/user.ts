import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  token: string | null;
  pseudo: string | null;
  email: string | null;
  money: number | null;
  isDarkMode: boolean;
}

const initialState: UserState = {
  token: null,
  pseudo: null,
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
        email: string | null;  
        money: number | null;  
        theme: boolean;
      }>,
    ) => {
      state.token = action.payload.token;
      state.pseudo = action.payload.pseudo;
      state.email = action.payload.email; 
      state.money = action.payload.money;
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
      state.email = null;
      state.money = null;
    },
  },
});

export const { setAuth, toggleTheme, setTheme, clearAuth } = userSlice.actions;
export default userSlice.reducer;