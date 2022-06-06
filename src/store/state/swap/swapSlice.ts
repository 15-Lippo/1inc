import { parseUnits } from '@ethersproject/units';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  QuoteResponseDto,
  SwapFactoryCommonControllerGetQuoteRequest,
  SwapFactoryCommonControllerGetSwapRequest,
  SwapResponseDto,
} from '@yozh-io/1inch-widget-api-client';

import { SwapApi } from '../../../api';

export const fetchQuote = createAsyncThunk(
  'swap/getQuoteInfo',
  async (
    param: {
      quoteInfo: SwapFactoryCommonControllerGetQuoteRequest;
      isTokenPriceInUsd?: boolean;
      fromTokenDecimals: number;
      toTokenDecimals?: number;
    },
    { getState }
  ) => {
    const state: any = getState();
    const [, usdcToken]: any = Object.entries(state.tokens.tokens).find(
      // @ts-ignore
      ([, token]) => token.name === 'USD Coin'
    );

    const price = {
      input: '',
      output: '',
    };

    try {
      const JSONApiResponse = await SwapApi.swapFactoryCommonControllerGetQuoteRaw(param.quoteInfo);

      const responseInfo = await JSONApiResponse.raw.json();

      if (param.quoteInfo.fromTokenAddress === usdcToken?.address) {
        price.input = '1000000';
      } else {
        // get price for 1 token:
        const InputJSONApiResponseUsdc = await SwapApi.swapFactoryCommonControllerGetQuoteRaw({
          fromTokenAddress: param.quoteInfo.fromTokenAddress,
          toTokenAddress: usdcToken?.address,
          amount: parseUnits('1', param.fromTokenDecimals).toString(),
        });
        const responseInputPrice =
          param.isTokenPriceInUsd && (await InputJSONApiResponseUsdc.raw.json());
        price.input = responseInputPrice?.toTokenAmount;
      }

      if (param.quoteInfo.toTokenAddress === usdcToken?.address) {
        price.output = '1000000';
      } else {
        const OutputJSONApiResponseUsdc = await SwapApi.swapFactoryCommonControllerGetQuoteRaw({
          fromTokenAddress: param.quoteInfo.toTokenAddress,
          toTokenAddress: usdcToken?.address,
          amount: parseUnits('1', param.toTokenDecimals).toString(),
        });
        const responseOutputPrice =
          param.isTokenPriceInUsd && (await OutputJSONApiResponseUsdc.raw.json());
        price.output = responseOutputPrice?.toTokenAmount;
      }

      return {
        info: responseInfo,
        price,
      };
    } catch (error) {
      console.error(error);
    }
  }
);

export const fetchSwap = createAsyncThunk(
  'swap/getSwapInfo',
  async (swapInfo: SwapFactoryCommonControllerGetSwapRequest) => {
    try {
      const JSONApiResponse = await SwapApi.swapFactoryCommonControllerGetSwapRaw(swapInfo);
      const response = await JSONApiResponse.raw.json();
      return response;
    } catch (error) {
      console.error(error);
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
  readonly tokenPriceInUsd?: {
    readonly input: string;
    readonly output: string;
  };
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
  tokenPriceInUsd: {
    input: '',
    output: '',
  },
  loading: 'idle',
  loadingQuote: 'idle',
  error: null,
};

const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    setSlippage(state, { payload: { percent } }) {
      return {
        ...state,
        slippage: percent,
      };
    },
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
      if (action.payload) {
        state.quoteInfo = action.payload.info;
        state.tokenPriceInUsd = action.payload.price;
        state.loadingQuote = 'succeeded';
      }
    });
    user.addCase(fetchSwap.fulfilled, (state, action) => {
      state.swapInfo = action.payload;
    });
  },
});

export const { setSlippage, selectCurrency, switchCurrencies, typeInput } = swapSlice.actions;

const { reducer } = swapSlice;

export default reducer;
