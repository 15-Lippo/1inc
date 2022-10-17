import { BigNumberish } from '@ethersproject/bignumber';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ethereumApi } from '@yozh-io/1inch-widget-api-client';

import { SwapApi } from '../../../api';
import { getNetworkConfig, Tokens } from '../../../constants';
import { GasOption } from '../../../hooks';
import { DefaultTokenOptions, Field, ReferrerOptions, SupportedGasOptions } from '../../../types';
import { getSwapApiData } from '../../../utils';

interface FetchQuoteParams {
  quoteInfo: ethereumApi.ExchangeControllerGetQuoteRequest;
  chainId: number | undefined;
}

interface FetchSwapParams {
  swapInfo: ethereumApi.ExchangeControllerGetSwapRequest;
  chainId: number | undefined;
}

export const fetchQuote = createAsyncThunk('swap/getQuoteInfo', async (params: FetchQuoteParams) => {
  return getSwapApiData(SwapApi(params.chainId).exchangeControllerGetQuoteRaw(params.quoteInfo));
});

export const fetchSwap = createAsyncThunk('swap/getSwapInfo', async (params: FetchSwapParams) => {
  return getSwapApiData(SwapApi(params.chainId).exchangeControllerGetSwapRaw(params.swapInfo));
});

export interface SwapState {
  readonly independentField: Field;
  readonly slippage: number;
  readonly typedValue: BigNumberish;
  readonly [Field.INPUT]: string;
  readonly [Field.OUTPUT]: string;
  readonly referrerOptions: ReferrerOptions;
  readonly defaultInputTokenAddress: DefaultTokenOptions;
  readonly defaultOutputTokenAddress: DefaultTokenOptions;
  readonly defaultTypedValue: BigNumberish;
  // the typed recipient address if swap should go to sender
  readonly recipient: string | null;
  readonly quoteInfo?: ethereumApi.QuoteResponseDto;
  readonly swapInfo?: ethereumApi.SwapResponseDto;
  readonly txFeeCalculation: {
    readonly gasPriceInfo: GasOption;
    readonly customGasPrice: {
      label: string;
      maxPriorityFee: string;
      maxFee: string;
      range: string;
      timeLabel: string;
    };
    readonly gasPriceSettingsMode: 'basic' | 'advanced';
    readonly gasLimit?: string;
    readonly maxFeePerGas?: string;
    readonly txFee?: string;
  };
  readonly loading?: 'idle' | 'pending' | 'succeeded' | 'failed';
  readonly loadingQuote?: 'idle' | 'pending' | 'succeeded' | 'failed';
  readonly loadingSwapInfo?: 'idle' | 'pending' | 'succeeded' | 'failed';
  readonly quoteError?: any;
  readonly swapError?: any;
  lastQuoteUpdateTimestamp: number;
}

export const initialState: SwapState = {
  independentField: Field.INPUT,
  slippage: 1,
  typedValue: '0',
  [Field.INPUT]: '',
  [Field.OUTPUT]: '',
  referrerOptions: {
    1: {
      referrerAddress: '',
      fee: '',
    },
  },
  defaultInputTokenAddress: {
    1: '',
  },
  defaultOutputTokenAddress: {
    1: '',
  },
  defaultTypedValue: '',
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
      id: SupportedGasOptions.High,
      label: '',
      range: '-- / -- - 0.00 Gwei',
      timeLabel: '',
      price: '0',
      baseFee: '0',
    },
    customGasPrice: {
      label: '',
      maxFee: '0',
      maxPriorityFee: '0',
      range: '',
      timeLabel: '',
    },
    gasPriceSettingsMode: 'basic',
    gasLimit: '',
    maxFeePerGas: '',
    txFee: '',
  },
  loading: 'idle',
  loadingQuote: 'idle',
  loadingSwapInfo: 'idle',
  quoteError: null,
  swapError: null,
  lastQuoteUpdateTimestamp: -1,
};

const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    setSlippage(state, { payload: { percent } }) {
      state.slippage = percent;
    },
    switchCurrencies(state) {
      return {
        ...state,
        independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        [Field.INPUT]: state[Field.OUTPUT],
        [Field.OUTPUT]: state[Field.INPUT],
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
    typeInput(state, { payload: { field, typedValue } }) {
      return {
        ...state,
        independentField: field,
        typedValue: typedValue.toString(),
      };
    },
    // Working with default settings
    setDefaultSettings(
      state,
      { payload: { referrerOptions, defaultInputTokenAddress, defaultOutputTokenAddress, defaultTypedValue } }
    ) {
      state.referrerOptions = referrerOptions ?? state.referrerOptions;
      state.defaultInputTokenAddress = defaultInputTokenAddress ?? state.defaultInputTokenAddress;
      state.defaultOutputTokenAddress = defaultOutputTokenAddress ?? state.defaultOutputTokenAddress;
      state.defaultTypedValue = defaultTypedValue ?? state.defaultTypedValue;
    },
    applyDefaultSettings(state, { payload: { chainId } }) {
      const info = getNetworkConfig(chainId);
      const onSupportedChain = info !== undefined;

      // set default tokens ans typedValue if only connector on supported chain id
      if (onSupportedChain) {
        state[Field.INPUT] = state.defaultInputTokenAddress[chainId] || Tokens.FAVORITE_TOKENS[chainId][0];
        // @ts-ignore
        state[Field.OUTPUT] =
          state.defaultOutputTokenAddress[chainId] ||
          Tokens.FAVORITE_TOKENS[chainId].filter((token: string) => token != state[Field.INPUT])[0];
        state.typedValue = state.defaultTypedValue[chainId]?.toString() || '';
      }
    },
    setGasLimit(state, { payload: gasLimit }) {
      return {
        ...state,
        txFeeCalculation: { ...state.txFeeCalculation, gasLimit },
      };
    },
    setGasPriceInfo(state, { payload: gasPriceInfo }) {
      return {
        ...state,
        txFeeCalculation: { ...state.txFeeCalculation, gasPriceInfo },
      };
    },
    setCustomGasPrice(state, { payload: customGasPrice }) {
      return {
        ...state,
        txFeeCalculation: { ...state.txFeeCalculation, customGasPrice },
      };
    },
    setGasPriceSettingsMode(state, { payload: mode }) {
      return {
        ...state,
        txFeeCalculation: { ...state.txFeeCalculation, gasPriceSettingsMode: mode },
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
    user.addCase(fetchQuote.pending, (state) => {
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
        state.lastQuoteUpdateTimestamp = performance.now();
      }
    });
    user.addCase(fetchSwap.pending, (state) => {
      state.loadingSwapInfo = 'pending';
    });
    user.addCase(fetchSwap.rejected, (state, action) => {
      if (state.loadingSwapInfo === 'pending') {
        state.loadingSwapInfo = 'idle';
        state.swapError = action.error;
      }
    });
    user.addCase(fetchSwap.fulfilled, (state, action) => {
      if (action.payload?.statusCode && action.payload?.statusCode !== 200) {
        state.loadingSwapInfo = 'failed';
        state.swapError = action.payload.description;
      } else {
        state.loadingSwapInfo = 'succeeded';
        state.swapError = null;
        state.swapInfo = action.payload;
      }
    });
  },
});

export const {
  setDefaultSettings,
  applyDefaultSettings,
  typeInput,
  selectCurrency,
  switchCurrencies,
  setSlippage,
  setGasLimit,
  setMaxFeePerGas,
  setTxFee,
  setGasPriceInfo,
  setCustomGasPrice,
  setGasPriceSettingsMode,
} = swapSlice.actions;

const { reducer } = swapSlice;

export default reducer;
