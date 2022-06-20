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
  async (quoteInfo: SwapFactoryCommonControllerGetQuoteRequest) => {
    try {
      const JSONApiResponse = await SwapApi.swapFactoryCommonControllerGetQuoteRaw(quoteInfo);
      const response = await JSONApiResponse.raw.json();
      return response;
    } catch (error) {
      // @ts-ignore
      const e = await error.json();
      return e;
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
  readonly txFeeCalculation: {
    readonly gasPriceInfo: {
      label: string;
      range: string;
      timeLabel: string;
      price: string;
    };
    readonly gasLimit?: string;
    readonly maxFeePerGas?: string;
    readonly txFee?: string;
  };
  readonly loading?: 'idle' | 'pending' | 'succeeded' | 'failed';
  readonly loadingQuote?: 'idle' | 'pending' | 'succeeded' | 'failed';
  readonly quoteError?: any;
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
  txFeeCalculation: {
    gasPriceInfo: {
      label: '',
      range: '-- / -- - 0.00 Gwei',
      timeLabel: '',
      price: '0',
    },
    gasLimit: '130000',
    maxFeePerGas: '',
    txFee: '',
  },
  loading: 'idle',
  loadingQuote: 'idle',
  quoteError: null,
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
    setGasLimit(state, { payload: gasLimit }) {
      return {
        ...state,
        txFeeCalculation: { ...state.txFeeCalculation, gasLimit },
      };
    },
    setGasPriceInfo(state, { payload: gasPriceInfo }) {
      console.log('setGasPriceInfo', gasPriceInfo);
      return {
        ...state,
        txFeeCalculation: { ...state.txFeeCalculation, gasPriceInfo },
      };
    },
    setMaxFeePerGas(state, { payload: maxFeePerGas }) {
      return {
        ...state,
        txFeeCalculation: { ...state.txFeeCalculation, maxFeePerGas },
      };
    },
    setTxFee(state, { payload: txFee }) {
      return {
        ...state,
        txFeeCalculation: { ...state.txFeeCalculation, txFee },
      };
    },
  },
  extraReducers: (user) => {
    user.addCase(fetchQuote.pending, (state, action) => {
      state.loadingQuote = 'pending';
    });
    user.addCase(fetchQuote.rejected, (state, action) => {
      if (state.loadingQuote === 'pending') {
        state.loadingQuote = 'idle';
        state.quoteError = action.error;
      }
    });
    user.addCase(fetchQuote.fulfilled, (state, action) => {
      if (action.payload?.statusCode && action.payload?.statusCode !== 200) {
        state.loadingQuote = 'failed';
        state.quoteError = action.payload.description;
      } else {
        state.loadingQuote = 'succeeded';
        state.quoteError = null;
        state.quoteInfo = action.payload;
      }
    });
    user.addCase(fetchSwap.fulfilled, (state, action) => {
      state.swapInfo = action.payload;
    });
  },
});

export const {
  setSlippage,
  selectCurrency,
  switchCurrencies,
  typeInput,
  setGasLimit,
  setMaxFeePerGas,
  setTxFee,
  setGasPriceInfo,
} = swapSlice.actions;

const { reducer } = swapSlice;

export default reducer;
