import { createSlice } from '@reduxjs/toolkit';

import { MainnetChainId, networkConfigs } from '../../../constants';
import { SupportedChainId } from '../../../types';

export interface UserState {
  userDarkMode: boolean | null; // the user's choice for dark mode or light mode
  explorer: { name: string; link: string };
}

export const initialState: UserState = {
  userDarkMode: null,
  explorer: {
    name: networkConfigs[MainnetChainId].explorerName,
    link: networkConfigs[MainnetChainId].blockExplorerUrls[0],
  },
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
        explorer: {
          name: networkConfigs[chainId as SupportedChainId]?.explorerName,
          link: networkConfigs[chainId as SupportedChainId]?.blockExplorerUrls[0],
        },
      };
    },
  },
});

export const { updateUserDarkMode, setExplorer } = userSlice.actions;

const { reducer } = userSlice;

export default reducer;
