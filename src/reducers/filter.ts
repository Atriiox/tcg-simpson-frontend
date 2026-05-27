import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilteringState {
  rarity: number[] ;
  type: string[];
  serie: string[];
}

const initialState: FilteringState = {
  rarity: [],
  type: [],
  serie: [],
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {

    rarity: (state, action: PayloadAction<number>) => {
      state.rarity.push(action.payload);
    },

    type: (state, action: PayloadAction<string>) => {
      state.type.push(action.payload);
    },

    serie: (state, action: PayloadAction<string>) => {
      state.serie.push(action.payload);
    },

  },
});


export const { rarity, type, serie } = filterSlice.actions;
export default filterSlice.reducer;