import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  ApproveCalldataResponseDto,
  ApproveFactoryControllerGetAllowanceRequest,
  ApproveFactoryControllerGetCallDataRequest,
  ApproveSpenderResponseDto,
} from '@yozh-io/1inch-widget-api-client';

import { ApproveApi } from '../../../api';

export const fetchApproveAllowance = createAsyncThunk(
  'tokens/getApproveAllowanceInfo',
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
  'tokens/getApproveTransactionInfo',
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
  'tokens/getApproveSpenderInfo',
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
  approveAllowanceInfo: void;
  approveTransactionInfo: ApproveCalldataResponseDto;
  approveSpenderInfo: ApproveSpenderResponseDto;
}

export const initialState: TokensState = {
  approveAllowanceInfo: undefined,
  approveTransactionInfo: {
    data: '',
    gasPrice: '',
    to: '',
    value: '',
  },
  approveSpenderInfo: { address: '' },
};

const approveSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {},
  extraReducers: (tokens) => {
    tokens.addCase(fetchApproveAllowance.fulfilled, (state, action) => {
      state.approveAllowanceInfo = action.payload;
    });
    tokens.addCase(fetchApproveTransaction.fulfilled, (state, action) => {
      state.approveTransactionInfo = action.payload;
    });
    tokens.addCase(fetchApproveSpender.fulfilled, (state, action) => {
      state.approveSpenderInfo = action.payload;
    });
  },
});

const { reducer } = approveSlice;

export default reducer;
