import { createSlice } from "@reduxjs/toolkit";

const initialCounterState = { navMenuTree: [] };

const navMenuSlice = createSlice({
  name: "navMenu",
  initialState: initialCounterState,
  reducers: {
    // setNavMenuTree(state) {
    //     state.isMember = !state.isMember;
    // },
  },
});

export const navMenuActions = navMenuSlice.actions;

export default navMenuSlice.reducer;
