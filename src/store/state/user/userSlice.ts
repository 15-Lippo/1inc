import { createSlice } from '@reduxjs/toolkit';

import { EXPLORER_LINKS } from '../../../constants';
import { SupportedChainId } from '../../../constants/chains';

export interface UserState {
  userDarkMode: boolean | null; // the user's choice for dark mode or light mode
  explorer: { name: string; link: string };
}

export const initialState: UserState = {
  userDarkMode: null,
  explorer: EXPLORER_LINKS[SupportedChainId.MAINNET],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserDarkMode(state, action) {
      return {
        ...state,
        userDarkMode: action.payload.userDarkMode,
      };
    },
    setExplorer(state, { payload: { chainId } }) {
      return {
        ...state,
        explorer: EXPLORER_LINKS[chainId as SupportedChainId],
      };
    },
  },
});

export const { updateUserDarkMode, setExplorer } = userSlice.actions;

const { reducer } = userSlice;

export default reducer;
