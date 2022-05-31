import { createSlice } from '@reduxjs/toolkit';

export interface TransactionsState {
  readonly lastTxHash: string;
}

export const initialState: TransactionsState = {
  lastTxHash: '',
};

const txSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setLastTxHash(state, { payload: txHash }) {
      return {
        ...state,
        lastTxHash: txHash,
      };
    },
    cleanLastTxHash(state) {
      return {
        ...state,
        lastTxHash: '',
      };
    },
  },
});

export const { setLastTxHash, cleanLastTxHash } = txSlice.actions;

const { reducer } = txSlice;

export default reducer;
