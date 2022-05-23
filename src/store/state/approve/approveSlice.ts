import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  ApproveCalldataResponseDto,
  ApproveFactoryControllerGetCallDataRequest,
  ApproveSpenderResponseDto,
} from '@yozh-io/1inch-widget-api-client';

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

export const fetchApproveTransaction = createAsyncThunk(
  'approve/getApproveTransactionInfo',
  async (approveInfo: ApproveFactoryControllerGetCallDataRequest, { rejectWithValue }) => {
    try {
      const JSONApiResponse = await ApproveApi.approveFactoryControllerGetCallDataRaw(approveInfo);
      const response = await JSONApiResponse.raw.json();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchApproveSpender = createAsyncThunk(
  'approve/getApproveSpenderInfo',
  async (approveInfo, { rejectWithValue }) => {
    try {
      const JSONApiResponse = await ApproveApi.approveFactoryControllerGetSpenderRaw();
      const response = await JSONApiResponse.raw.json();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export interface TokensState {
  approveAllowanceInfo: ApprovalState;
  approveTransactionInfo: ApproveCalldataResponseDto;
  spender: ApproveSpenderResponseDto;
}

export const initialState: TokensState = {
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
  },
});

export const { updateApproveStatus } = approveSlice.actions;

const { reducer } = approveSlice;

export default reducer;
