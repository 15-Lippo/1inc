import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ProtocolsResponseDto } from '@yozh-io/1inch-widget-api-client';

import { InfoApi } from '../../../api';

export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
  userBalance?: string;
  userAllowance?: string;
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
      return response.tokens;
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
  tokens: { [key: string]: Token };
  fetchingTokens: boolean;
  tokenInfoFetched: boolean;
  liquiditySourcesInfo?: ProtocolsResponseDto;
  presetsInfo?: void;
}

export const initialState: TokensState = {
  tokens: {},
  fetchingTokens: false,
  tokenInfoFetched: false,
  liquiditySourcesInfo: { protocols: [] },
  presetsInfo: undefined,
};

const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    updateAllTokenBalances(state, action) {
      const { tokens } = state;
      for (const address in action.payload) {
        if (address.toLowerCase() === '0x0000000000000000000000000000000000000000') {
          tokens['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].userBalance =
            action.payload[address].balance;
          tokens['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].userAllowance =
            action.payload[address].allowance;
          continue;
        }

        if (address in tokens) {
          tokens[address].userBalance = action.payload[address].balance;
          tokens[address].userAllowance = action.payload[address].allowance;
        }
      }
      state.tokenInfoFetched = true;
    },
    updateTokenInfo(state, action) {
      state.tokens[action.payload.address].userBalance = action.payload.balance;
      state.tokens[action.payload.address].userAllowance = action.payload.allowance;
    },
  },
  extraReducers: (tokens) => {
    tokens.addCase(fetchLiquiditySources.fulfilled, (state, action) => {
      state.liquiditySourcesInfo = action.payload;
    });
    tokens.addCase(fetchTokens.pending, (state, action) => {
      state.fetchingTokens = true;
    });
    tokens.addCase(fetchTokens.rejected, (state, action) => {
      state.fetchingTokens = false;
    });
    tokens.addCase(fetchTokens.fulfilled, (state, action) => {
      state.tokens = action.payload;
      state.fetchingTokens = false;
    });
    tokens.addCase(fetchPresets.fulfilled, (state, action) => {
      state.presetsInfo = action.payload;
    });
  },
});

export const { updateAllTokenBalances, updateTokenInfo } = tokensSlice.actions;

const { reducer } = tokensSlice;

export default reducer;
