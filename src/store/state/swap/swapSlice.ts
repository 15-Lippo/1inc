import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  QuoteResponseDto,
  SwapFactoryCommonControllerGetQuoteRequest,
  SwapFactoryCommonControllerGetSwapRequest,
  SwapResponseDto,
} from '@yozh-io/1inch-widget-api-client';

import { SwapApi } from '../../../api';

export const fetchQuote = createAsyncThunk(
  'user/getQuoteInfo',
  async (
    param: {
      quoteInfo: SwapFactoryCommonControllerGetQuoteRequest;
      isTokenPriceInUsd?: boolean;
    },
    { getState, rejectWithValue }
  ) => {
    const state: any = getState();
    const usdcToken: any = Object.entries(state.tokens.tokens).find(
      (token: any) => token[1].name === 'USD Coin'
    );

    const tokenPriceInUsdInfo = {
      fromTokenAddress: param.quoteInfo.fromTokenAddress,
      toTokenAddress: usdcToken?.[1].address,
      amount: param.quoteInfo.amount,
    };
    try {
      const JSONApiResponse = await SwapApi.swapFactoryCommonControllerGetQuoteRaw(param.quoteInfo);
      const JSONApiResponseUsdc = await SwapApi.swapFactoryCommonControllerGetQuoteRaw(
        tokenPriceInUsdInfo
      );
      const responseInfo = await JSONApiResponse.raw.json();
      const responsePrice = param.isTokenPriceInUsd && (await JSONApiResponseUsdc.raw.json());
      return { info: responseInfo, price: responsePrice?.toTokenAmount };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchSwap = createAsyncThunk(
  'user/getSwapInfo',
  async (swapInfo: SwapFactoryCommonControllerGetSwapRequest, { rejectWithValue }) => {
    try {
      const JSONApiResponse = await SwapApi.swapFactoryCommonControllerGetSwapRaw(swapInfo);
      const response = await JSONApiResponse.raw.json();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export interface SwapState {
  readonly independentField: Field;
  readonly slippage: number;
  readonly typedValue: string;
  readonly [Field.INPUT]: string;
  readonly [Field.OUTPUT]: string;
  // the typed recipient address if swap should go to sender
  readonly recipient: string | null;
  readonly quoteInfo?: QuoteResponseDto;
  readonly swapInfo?: SwapResponseDto;
  readonly tokenPriceInUsd?: string;
  readonly loading?: 'idle' | 'pending' | 'succeeded' | 'failed';
  readonly loadingQuote?: 'idle' | 'pending' | 'succeeded' | 'failed';
  readonly error?: any;
}

export const initialState: SwapState = {
  independentField: Field.INPUT,
  slippage: 1,
  typedValue: '',
  [Field.INPUT]: '',
  [Field.OUTPUT]: '',
  recipient: null,
  quoteInfo: {
    fromToken: {
      symbol: '',
      name: '',
      address: '',
      decimals: 0,
      logoURI: '',
    },
    toToken: {
      symbol: '',
      name: '',
      address: '',
      decimals: 0,
      logoURI: '',
    },
    toTokenAmount: '',
    fromTokenAmount: '',
    protocols: [],
    estimatedGas: 0,
  },
  swapInfo: {
    fromToken: {
      symbol: '',
      name: '',
      address: '',
      decimals: 0,
      logoURI: '',
    },
    toToken: {
      symbol: '',
      name: '',
      address: '',
      decimals: 0,
      logoURI: '',
    },
    toTokenAmount: '',
    fromTokenAmount: '',
    protocols: [],
    tx: {
      from: '',
      to: '',
      data: '',
      value: '',
      gasPrice: '',
      gas: '',
    },
  },
  tokenPriceInUsd: '',
  loading: 'idle',
  loadingQuote: 'idle',
  error: null,
};

const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    selectCurrency(state, { payload: { currency, field } }) {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT;
      if (currency === state[otherField]) {
        const flipCurrency = state[field as Field];
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [field]: currency,
          [otherField]: flipCurrency,
        };
      }

      // the normal case
      return {
        ...state,
        [field]: currency,
      };
    },
    switchCurrencies(state) {
      return {
        ...state,
        independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        [Field.INPUT]: state[Field.OUTPUT],
        [Field.OUTPUT]: state[Field.INPUT],
      };
    },
    typeInput(state, { payload: { field, typedValue } }) {
      return {
        ...state,
        independentField: field,
        typedValue,
      };
    },
  },
  extraReducers: (user) => {
    user.addCase(fetchQuote.pending, (state, action) => {
      state.loadingQuote = 'pending';
    });
    user.addCase(fetchQuote.rejected, (state, action) => {
      state.loadingQuote = 'failed';
    });
    user.addCase(fetchQuote.fulfilled, (state, action) => {
      state.quoteInfo = action.payload.info;
      state.tokenPriceInUsd = action.payload.price;
      state.loadingQuote = 'succeeded';
    });
    user.addCase(fetchSwap.fulfilled, (state, action) => {
      state.swapInfo = action.payload;
    });
  },
});

export const { selectCurrency, switchCurrencies, typeInput } = swapSlice.actions;

const { reducer } = swapSlice;

export default reducer;
