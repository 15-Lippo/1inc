import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ProtocolsResponseDto, TokensResponseDto } from '@yozh-io/1inch-widget-api-client';

import { InfoApi } from '../../../api';

export const fetchLiquiditySources = createAsyncThunk(
  'tokens/getLiquiditySourcesInfo',
  async (userData, { rejectWithValue }) => {
    try {
      const JSONApiResponse = await InfoApi.chainProtocolControllerGetProtocolsImagesRaw();
      const response = await JSONApiResponse.raw.json();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchTokens = createAsyncThunk(
  'tokens/getTokensInfo',
  async (userData, { rejectWithValue }) => {
    try {
      const JSONApiResponse = await InfoApi.chainTokensControllerGetTokensRaw();
      const response = await JSONApiResponse.raw.json();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchPresets = createAsyncThunk(
  'tokens/getPresetsInfo',
  async (userData, { rejectWithValue }) => {
    try {
      const JSONApiResponse = await InfoApi.chainPresetsControllerGetPresetsRaw();
      const response = await JSONApiResponse.raw.json();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export interface TokensState {
  // eslint-disable-next-line @typescript-eslint/ban-types
  tokensList: {};
  liquiditySourcesInfo?: ProtocolsResponseDto;
  tokensInfo?: TokensResponseDto;
  presetsInfo?: void;
}

export const initialState: TokensState = {
  tokensList: {},
  liquiditySourcesInfo: { protocols: [] },
  tokensInfo: { tokens: [] },
  presetsInfo: undefined,
};

const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    allTokenBalances(state, action) {
      state.tokensList = action.payload.balances;
    },
  },
  extraReducers: (tokens) => {
    tokens.addCase(fetchLiquiditySources.fulfilled, (state, action) => {
      state.liquiditySourcesInfo = action.payload;
    });
    tokens.addCase(fetchTokens.fulfilled, (state, action) => {
      state.tokensInfo = action.payload;
    });
    tokens.addCase(fetchPresets.fulfilled, (state, action) => {
      state.presetsInfo = action.payload;
    });
  },
});

export const { allTokenBalances } = tokensSlice.actions;

const { reducer } = tokensSlice;

export default reducer;
