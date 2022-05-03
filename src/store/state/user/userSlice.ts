import { createSlice } from '@reduxjs/toolkit';

export interface UserState {
  userDarkMode: boolean | null; // the user's choice for dark mode or light mode
}

export const initialState: UserState = {
  userDarkMode: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserDarkMode(state, action) {
      state.userDarkMode = action.payload.userDarkMode;
    },
  },
});

export const { updateUserDarkMode } = userSlice.actions;

const { reducer } = userSlice;

export default reducer;
