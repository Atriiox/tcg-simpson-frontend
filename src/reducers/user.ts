import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum ThemeMode {
  LIGHT = "light",
  DARK = "dark",
}

interface UserState {
  id: string | null;
  username: string | null;
  theme: ThemeMode;
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("theme");
    if (saved === ThemeMode.LIGHT || saved === ThemeMode.DARK) return saved as ThemeMode;
  }
  return ThemeMode.LIGHT;
};

const initialState: UserState = {
  id: null,
  username: null,
  theme: getInitialTheme(),
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // 1. Ton action pour basculer le thème
    toggleUserTheme: (state) => {
      const nextTheme = state.theme === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT;
      state.theme = nextTheme;

      if (typeof window !== "undefined") {
        localStorage.setItem("theme", nextTheme);
      }
    },
    
    setUserProfile: (state, action: PayloadAction<{ id: string; username: string; theme: ThemeMode }>) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.theme = action.payload.theme;
    },
  },
});

export const { toggleUserTheme, setUserProfile } = userSlice.actions;
export default userSlice.reducer;