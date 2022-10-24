import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ethereumApi } from '@yozh-io/1inch-widget-api-client';

import { ApproveApi } from '../../../api';

export enum ApproveStatus {
  UNKNOWN = 'UNKNOWN',
  APPROVAL_NEEDED = 'APPROVAL_NEEDED',
  PENDING = 'PENDING',
  NO_APPROVAL_NEEDED = 'NO_APPROVAL_NEEDED',
}

interface ApprovalState {
  status: ApproveStatus;
}

interface FetchApproveTransactionParams {
  approveInfo: ethereumApi.ChainApproveControllerGetCallDataRequest;
  chainId: number | undefined;
}

export const fetchApproveTransaction = createAsyncThunk(
  'approve/getApproveTransactionInfo',
  async (params: FetchApproveTransactionParams, { rejectWithValue }) => {
    try {
      const JSONApiResponse = await ApproveApi(params.chainId).chainApproveControllerGetCallDataRaw(params.approveInfo);
      return await JSONApiResponse.raw.json();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchApproveSpender = createAsyncThunk(
  'approve/getApproveSpenderInfo',
  async (chainId: number | undefined, { rejectWithValue }) => {
    try {
      const JSONApiResponse = await ApproveApi(chainId).chainApproveControllerGetSpenderRaw();
      return await JSONApiResponse.raw.json();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateSingleAllowance = createAsyncThunk(
  'approve/updateAllowance',
  async (updater: () => Promise<string>) => {
    const res = await updater();
    console.log('FETCHED ALLOWANCE:', res);
    return res;
  }
);

export interface ApproveState {
  approveAllowanceInfo: ApprovalState;
  approveTransactionInfo: ethereumApi.ApproveCalldataResponseDto;
  spender: ethereumApi.ApproveSpenderResponseDto;
  allowance: string;
}

export const initialState: ApproveState = {
  approveAllowanceInfo: {
    status: ApproveStatus.UNKNOWN,
  },
  approveTransactionInfo: {
    data: '',
    gasPrice: '',
    to: '',
    value: '',
  },
  spender: { address: '' },
  allowance: '',
};

const approveSlice = createSlice({
  name: 'approve',
  initialState,
  reducers: {
    updateApproveStatus(state, action) {
      state.approveAllowanceInfo.status = action.payload;
    },
  },
  extraReducers: (tokens) => {
    tokens.addCase(fetchApproveTransaction.fulfilled, (state, action) => {
      state.approveTransactionInfo = action.payload;
    });
    tokens.addCase(fetchApproveSpender.fulfilled, (state, action) => {
      state.spender = action.payload;
    });
    tokens.addCase(updateSingleAllowance.pending, () => {
      console.log('PENDING UPDATE ALLOWANCE');
    });
    tokens.addCase(updateSingleAllowance.fulfilled, (state, action) => {
      state.allowance = action.payload;
      console.log('UPDATE ALLOWANCE FULFILLED');
    });
    tokens.addCase(updateSingleAllowance.rejected, () => {
      console.log('UPDATE ALLOWANCE REJECTED');
    });
  },
});

export const { updateApproveStatus } = approveSlice.actions;

const { reducer } = approveSlice;

export default reducer;
