import { createSlice } from "@reduxjs/toolkit";

const initialCounterState = { isMember: true };

const authSlice = createSlice({
  name: "auth",
  initialState: initialCounterState,
  reducers: {
    isLogin(state) {
        state.isMember = !state.isMember;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
