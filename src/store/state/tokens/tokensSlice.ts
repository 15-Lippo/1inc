import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import { ProtocolsResponseDto } from '@yozh-io/1inch-widget-api-client';

import { InfoApi } from '../../../api';
import { MAIN_TOKENS } from '../../../constants';

export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
  userBalance?: string;
  userAllowance?: string;
  pinned?: boolean;
  priceInUsd?: string;
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

      const sortable = await Object.entries(response.tokens).sort(([, a], [, b]) => {
        // @ts-ignore
        const fa = a.name,
          // @ts-ignore
          fb = b.name;

        if (MAIN_TOKENS.includes(fa.toUpperCase())) return -1;
        if (MAIN_TOKENS.includes(fb.toUpperCase())) return 1;

        // compare ignoring case:
        if (fa.localeCompare(fb) > 0) return 1;
        if (fa.localeCompare(fb) < 0) return -1;
        return 0;
      });

      return sortable.reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
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
          tokens['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].priceInUsd =
            action.payload[address].priceInUsd;
          continue;
        }

        if (address in tokens) {
          tokens[address].userBalance = action.payload[address].balance;
          tokens[address].userAllowance = action.payload[address].allowance;
          tokens[address].pinned = action.payload[address].pinned;
          tokens[address].priceInUsd = action.payload[address].priceInUsd;
        }
      }
      // Sort all tokens by balances:
      if (current(state.tokens)) {
        state.tokens = Object.entries(current(state.tokens))
          .sort(([, a], [, b]) => {
            const fa = Number(a.userBalance),
              fb = Number(b.userBalance);
            if (fa > fb) return -1;
            if (fa < fb) return 1;
            return 0;
          })
          .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
      }

      state.tokenInfoFetched = true;
    },
    updateTokenInfo(state, action) {
      const { tokens } = state;
      console.log('==> payload: ', action.payload);

      const native = '0x0000000000000000000000000000000000000000';
      const tokenAddress = Object.keys(action.payload)[0];

      if (tokenAddress === native) {
        tokens['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].userBalance =
          action.payload[native].balance;
        tokens['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].userAllowance =
          action.payload[native].allowance;
        tokens['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].pinned = action.payload[native].pinned;
        tokens['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].priceInUsd =
          action.payload[native].priceInUsd;
      } else {
        tokens[tokenAddress].userBalance = action.payload[tokenAddress].balance;
        tokens[tokenAddress].userAllowance = action.payload[tokenAddress].allowance;
        tokens[tokenAddress].pinned = action.payload[tokenAddress].pinned;
        tokens[tokenAddress].priceInUsd = action.payload[tokenAddress].priceInUsd;
      }
    },
    onPinnedToken(
      state,
      { payload: { key, pinned } }: { payload: { key: string; pinned: boolean } }
    ) {
      return {
        ...state,
        tokens: {
          ...state.tokens,
          [key]: {
            ...state.tokens[key],
            pinned,
          },
        },
      };
    },
    updatePriceTokenInUsd(
      state,
      { payload: { key, priceInUsd } }: { payload: { key: string; priceInUsd?: string } }
    ) {
      return {
        ...state,
        tokens: {
          ...state.tokens,
          [key]: {
            ...state.tokens[key],
            priceInUsd,
          },
        },
      };
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

export const { updateAllTokenBalances, updateTokenInfo, onPinnedToken, updatePriceTokenInUsd } =
  tokensSlice.actions;

const { reducer } = tokensSlice;

export default reducer;
