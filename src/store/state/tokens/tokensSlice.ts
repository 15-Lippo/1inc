import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import { ethereumApi } from '@yozh-io/1inch-widget-api-client';

import { CoinsApi, InfoApi } from '../../../api';
import { LocalStorageKeys, Tokens } from '../../../constants';

export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
  userBalance?: string;
  userAllowance?: string;
  priceInUsd?: string;
  button?: any;
}

export const fetchCoinInfoById = createAsyncThunk('tokens/getCoinInfo', async (coinName: string) => {
  try {
    const id = coinName.replace(/\s+/g, '-').toLowerCase();

    const params = {
      localization: 'false',
      tickets: false,
      marketData: false,
      communityData: false,
      developerData: false,
      sparkline: false,
    };

    const JSONApiResponse = await CoinsApi.coinsIdGet(
      id,
      params.localization,
      params.tickets,
      params.marketData,
      params.communityData,
      params.developerData,
      params.sparkline
    );

    return await JSONApiResponse.json();
  } catch (e) {
    console.error(e);
  }
});

export const fetchLiquiditySources = createAsyncThunk(
  'tokens/getLiquiditySourcesInfo',
  async (chainId: number | undefined, { rejectWithValue }) => {
    try {
      return (await InfoApi(chainId).chainProtocolsControllerGetProtocolsImagesRaw()).raw.json();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchTokens = createAsyncThunk(
  'tokens/getTokensInfo',
  async (chainId: number | undefined, { rejectWithValue }) => {
    try {
      const existingTokens =
        // @ts-ignore
        JSON.parse(localStorage.getItem(LocalStorageKeys.imported_tokens)) ?? [];

      const JSONApiResponse = await InfoApi(chainId).chainTokensControllerGetTokensRaw();
      const response = await JSONApiResponse.raw.json();

      const sortable = await Object.entries({ ...response.tokens, ...existingTokens }).sort(([, a], [, b]) => {
        // @ts-ignore
        const fa = a.name,
          // @ts-ignore
          fb = b.name;

        if (Tokens.MAIN_TOKENS.includes(fa.toUpperCase())) return -1;
        if (Tokens.MAIN_TOKENS.includes(fb.toUpperCase())) return 1;

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
  async (chainId: number | undefined, { rejectWithValue }) => {
    try {
      return (await InfoApi(chainId).chainPresetsControllerGetPresetsRaw()).raw.json();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export interface TokensState {
  lastImportedTokenInfo: {
    image: '';
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  };
  // eslint-disable-next-line @typescript-eslint/ban-types
  tokens: { [key: string]: Token };
  fetchingTokens: boolean;
  tokenInfoFetched: boolean;
  liquiditySourcesInfo?: ethereumApi.ProtocolsResponseDto;
  presetsInfo?: void;
}

export const initialState: TokensState = {
  lastImportedTokenInfo: {
    image: '',
    loading: 'idle',
  },
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
    removeTokenFromAllTokens(state, action) {
      const { tokens } = state;
      const filtered = {};
      Object.keys(tokens).filter((prop) => {
        if (prop !== action.payload) {
          // @ts-ignore
          return (filtered[prop] = tokens[prop]);
        }
      });
      return {
        ...state,
        tokens: filtered,
      };
    },
    addTokenToAllTokens(state, action) {
      const { tokens } = state;
      return {
        ...state,
        tokens: {
          ...tokens,
          [action.payload.address]: action.payload,
        },
      };
    },
    updateAllTokenBalances(state, action) {
      const { tokens } = state;
      for (const address in action.payload) {
        if (address.toLowerCase() === '0x0000000000000000000000000000000000000000') {
          tokens['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].userBalance = action.payload[address].balance;
          tokens['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].userAllowance = action.payload[address].allowance;
          tokens['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].priceInUsd = action.payload[address].priceInUsd;
          continue;
        }

        if (address in tokens) {
          tokens[address].userBalance = action.payload[address].balance;
          tokens[address].userAllowance = action.payload[address].allowance;
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

      const native = '0x0000000000000000000000000000000000000000';
      const inchNative = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
      const tokenAddress = Object.keys(action.payload)[0];

      if (tokenAddress === native) {
        tokens[inchNative].userBalance = action.payload[native].balance;
        tokens[inchNative].userAllowance = action.payload[native].allowance;
        tokens[inchNative].priceInUsd = action.payload[native].priceInUsd;
      } else {
        tokens[tokenAddress].userBalance = action.payload[tokenAddress].balance;
        tokens[tokenAddress].userAllowance = action.payload[tokenAddress].allowance;
        tokens[tokenAddress].priceInUsd = action.payload[tokenAddress].priceInUsd;
      }
    },
    updatePriceTokenInUsd(state, { payload }: { payload: { key: string; priceInUsd?: string }[] }) {
      const updatedTokens = { ...state.tokens };
      payload.forEach(({ key, priceInUsd }) => {
        updatedTokens[key] = {
          ...state.tokens[key],
          priceInUsd,
        };
      });
      return {
        ...state,
        tokens: updatedTokens,
      };
    },
  },
  extraReducers: (tokens) => {
    tokens.addCase(fetchCoinInfoById.fulfilled, (state, action) => {
      if (action.payload) {
        const { image } = action.payload;
        state.lastImportedTokenInfo = {
          image: image?.large || image?.small || image?.thumb,
          loading: 'succeeded',
        };
      }
    });
    tokens.addCase(fetchCoinInfoById.pending, (state) => {
      state.lastImportedTokenInfo = {
        image: '',
        loading: 'pending',
      };
    });
    tokens.addCase(fetchCoinInfoById.rejected, (state) => {
      state.lastImportedTokenInfo = {
        image: '',
        loading: 'failed',
      };
    });
    tokens.addCase(fetchLiquiditySources.fulfilled, (state, action) => {
      state.liquiditySourcesInfo = action.payload;
    });
    tokens.addCase(fetchTokens.pending, (state) => {
      state.fetchingTokens = true;
    });
    tokens.addCase(fetchTokens.rejected, (state) => {
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

export const {
  addTokenToAllTokens,
  removeTokenFromAllTokens,
  updateAllTokenBalances,
  updateTokenInfo,
  updatePriceTokenInUsd,
} = tokensSlice.actions;

const { reducer } = tokensSlice;

export default reducer;
