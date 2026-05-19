import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string | null;
  username: string | null;
}

const initialState: UserState = {
  id: null,
  username: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (
      state,
      action: PayloadAction<{ id: string; username: string }>,
    ) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
    },
  },
});

export const { setUserProfile } = userSlice.actions;
export default userSlice.reducer;
