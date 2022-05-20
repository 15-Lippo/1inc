import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ProtocolsResponseDto } from '@yozh-io/1inch-widget-api-client';

import { InfoApi } from '../../../api';

export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
  tokenAmount?: string;
}

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

      return Object.values(response.tokens ?? {});
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
  tokensList: Token[];
  liquiditySourcesInfo?: ProtocolsResponseDto;
  // tokensInfo?: TokensResponseDto;
  presetsInfo?: void;
}

export const initialState: TokensState = {
  tokensList: [],
  liquiditySourcesInfo: { protocols: [] },
  presetsInfo: undefined,
};

const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    updateAllTokenBalances(state, action) {
      state.tokensList = action.payload;
    },
  },
  extraReducers: (tokens) => {
    tokens.addCase(fetchLiquiditySources.fulfilled, (state, action) => {
      state.liquiditySourcesInfo = action.payload;
    });
    tokens.addCase(fetchTokens.fulfilled, (state, action) => {
      state.tokensList = action.payload as Token[];
    });
    tokens.addCase(fetchPresets.fulfilled, (state, action) => {
      state.presetsInfo = action.payload;
    });
  },
});

export const { updateAllTokenBalances } = tokensSlice.actions;

const { reducer } = tokensSlice;

export default reducer;
