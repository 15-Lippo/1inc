import { createSlice } from '@reduxjs/toolkit';

export interface TransactionsState {
  readonly isWaitingTx: boolean;
  readonly lastTxHash: string;
  readonly txErrorMessage: string;
}

export const initialState: TransactionsState = {
  isWaitingTx: false,
  lastTxHash: '',
  txErrorMessage: '',
};

const txSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTxErrorMessage(state, { payload: txErrorMessage }) {
      return {
        ...state,
        txErrorMessage,
      };
    },
    setIsWaitingTx(state, { payload: isWaitingTx }) {
      return {
        ...state,
        isWaitingTx,
      };
    },
    setLastTxHash(state, { payload: txHash }) {
      return {
        ...state,
        setTxErrorMessage: '',
        isWaitingTx: false,
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

export const { setTxErrorMessage, setIsWaitingTx, setLastTxHash, cleanLastTxHash } =
  txSlice.actions;

const { reducer } = txSlice;

export default reducer;
