import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  ApproveCalldataResponseDto,
  ApproveFactoryControllerGetAllowanceRequest,
  ApproveFactoryControllerGetCallDataRequest,
  ApproveSpenderResponseDto,
} from '@yozh-io/1inch-widget-api-client';

import { ApproveApi } from '../../../api';

export enum ApproveStatus {
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

interface ApprovalState {
  allowance: string;
  status: ApproveStatus;
}

export const fetchApproveAllowance = createAsyncThunk(
  'approve/getApproveAllowanceInfo',
  async (approveInfo: ApproveFactoryControllerGetAllowanceRequest, { rejectWithValue }) => {
    try {
      const JSONApiResponse = await ApproveApi.approveFactoryControllerGetAllowanceRaw(approveInfo);
      const response = await JSONApiResponse.raw.json();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

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
  approveSpenderInfo: ApproveSpenderResponseDto;
}

export const initialState: TokensState = {
  approveAllowanceInfo: {
    allowance: '',
    status: ApproveStatus.UNKNOWN,
  },
  approveTransactionInfo: {
    data: '',
    gasPrice: '',
    to: '',
    value: '',
  },
  approveSpenderInfo: { address: '' },
};

const approveSlice = createSlice({
  name: 'approve',
  initialState,
  reducers: {
    updateAllowanceInfo(state, action) {
      state.approveAllowanceInfo.allowance = action.payload;
    },
    updateApproveStatus(state, action) {
      state.approveAllowanceInfo.status = action.payload;
    },
  },
  extraReducers: (tokens) => {
    tokens.addCase(fetchApproveAllowance.fulfilled, (state, action) => {
      state.approveAllowanceInfo.allowance = action.payload.allowance;
    });
    tokens.addCase(fetchApproveTransaction.fulfilled, (state, action) => {
      state.approveTransactionInfo = action.payload;
    });
    tokens.addCase(fetchApproveSpender.fulfilled, (state, action) => {
      state.approveSpenderInfo = action.payload;
    });
  },
});

export const { updateApproveStatus, updateAllowanceInfo } = approveSlice.actions;

const { reducer } = approveSlice;

export default reducer;
