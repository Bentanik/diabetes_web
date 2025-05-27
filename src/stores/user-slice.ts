import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InitialState {
  user: API.TAuthUserDto | null;
}

let initialState: InitialState = {
  user: null,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState: initialState,
  reducers: {
    setInfoUser: (state, action: PayloadAction<API.TAuthUserDto>) => {
      state.user = { ...action.payload };
    },
    clearInfoUser: (state) => {
      state.user = null;
    },
  },
});

export const { setInfoUser, clearInfoUser } = userSlice.actions;

export default userSlice.reducer;
