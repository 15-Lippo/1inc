import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  QuoteResponseDto,
  SwapFactoryCommonControllerGetQuoteRequest,
  SwapFactoryCommonControllerGetSwapRequest,
  SwapResponseDto,
} from '@yozh-io/1inch-widget-api-client';

import { SwapApi } from '../../../api/index';

export const fetchQuote = createAsyncThunk(
  'user/getQuoteInfo',
  async (quoteInfo: SwapFactoryCommonControllerGetQuoteRequest, { rejectWithValue }) => {
    try {
      const JSONApiResponse = await SwapApi.swapFactoryCommonControllerGetQuoteRaw(quoteInfo);
      const response = await JSONApiResponse.raw.json();
      return response;
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
  readonly typedValue: string;
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined | null;
  };
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined | null;
  };
  // the typed recipient address if swap should go to sender
  readonly recipient: string | null;
  readonly quoteInfo?: QuoteResponseDto;
  readonly swapInfo?: SwapResponseDto;
  readonly loading?: 'idle' | 'pending' | 'succeeded' | 'failed';
  readonly error?: any;
}

export const initialState: SwapState = {
  independentField: Field.INPUT,
  typedValue: '',
  [Field.INPUT]: {
    currencyId: null,
  },
  [Field.OUTPUT]: {
    currencyId: null,
  },
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
  loading: 'idle',
  error: null,
};

const swapSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    selectCurrency(state, { payload: { currencyId, field } }) {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT;
      if (currencyId === state[otherField].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [field]: { currencyId },
          // @ts-ignore
          [otherField]: { currencyId: state[field].currencyId },
        };
      } else {
        // the normal case
        return {
          ...state,
          [field]: { currencyId },
        };
      }
    },
    switchCurrencies(state) {
      return {
        ...state,
        independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        [Field.INPUT]: { currencyId: state[Field.OUTPUT].currencyId },
        [Field.OUTPUT]: { currencyId: state[Field.INPUT].currencyId },
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
    user.addCase(fetchQuote.fulfilled, (state, action) => {
      state.quoteInfo = action.payload;
    });
    user.addCase(fetchSwap.fulfilled, (state, action) => {
      state.swapInfo = action.payload;
    });
  },
});

export const { selectCurrency, switchCurrencies, typeInput } = swapSlice.actions;

const { reducer } = swapSlice;

export default reducer;
