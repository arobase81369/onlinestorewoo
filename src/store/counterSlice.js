// store/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  count: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: state => {
      state.count = (state.count == 10)? 10 : state.count + 1;
      console.log(state.count);
    },
    decrement: state => {
    //  state.count -= 1;
      state.count = (state.count == 0)? 0 : state.count - 1;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;
