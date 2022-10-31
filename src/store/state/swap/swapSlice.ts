import { BigNumberish } from '@ethersproject/bignumber';
import { TransactionRequest } from '@ethersproject/providers';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ethereumApi } from '@yozh-io/1inch-widget-api-client';

import { SwapApi } from '../../../api';
import { getNetworkConfig, Tokens } from '../../../constants';
import { ProtocolName } from '../../../constants/protocolNames';
import { GasOption } from '../../../hooks';
import { QuoteUpdater } from '../../../hooks/update/types';
import { QuoteInfo } from '../../../services/update';
import { DefaultTokenOptions, Field, ReferrerOptions, SupportedGasOptions } from '../../../types';
import { getSwapApiData } from '../../../utils';
import { calculateRoughFees } from '../../../utils/';

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

interface UpdateQuoteThunkArg {
  updaters: QuoteUpdater[];
  updateId: number;
}

export const updateQuote = createAsyncThunk(
  'swap/updateQuote',
  async ({ updaters }: UpdateQuoteThunkArg, { rejectWithValue }) => {
    const promises: Promise<QuoteInfo>[] = [];
    updaters.forEach((u: QuoteUpdater) => {
      promises.push(u.update());
    });
    try {
      const quoteData = await Promise.all(promises);
      console.log('Quote data:', quoteData);
      return quoteData.reduce((acc, curr, i) => {
        acc[updaters[i].name] = curr;
        return acc;
      }, {});
    } catch (e) {
      console.error(e);
      return rejectWithValue(e.message);
    }
  }
);

export interface TxInfo {
  tx?: TransactionRequest;
  toTokenAmount: string;
  gasLimit: string;
  route: any; // TODO come up with standard interface
}

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
  };
  readonly loading?: 'idle' | 'pending' | 'succeeded' | 'failed';
  readonly loadingQuote?: 'idle' | 'pending' | 'succeeded' | 'failed';
  readonly loadingSwapInfo?: 'idle' | 'pending' | 'succeeded' | 'failed';
  readonly quoteError?: any;
  readonly swapError?: any;
  readonly lastQuoteUpdateTimestamp: number;
  readonly lastQuoteCallId: number;
  readonly swapData: { [protocolName: string]: QuoteInfo };
  readonly selectedMethod: string;
  readonly txFees: { [protocolName: string]: string };
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
  },
  loading: 'idle',
  loadingQuote: 'idle',
  loadingSwapInfo: 'idle',
  quoteError: null,
  swapError: null,
  lastQuoteUpdateTimestamp: -1,
  lastQuoteCallId: -1,
  swapData: {},
  selectedMethod: ProtocolName.ONE_INCH,
  txFees: {},
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
    setGasPriceInfo(state, { payload: gasPriceInfo }) {
      return {
        ...state,
        txFeeCalculation: { ...state.txFeeCalculation, gasPriceInfo },
        txFees: calculateRoughFees(state.swapData, gasPriceInfo.price),
      };
    },
    setCustomGasPrice(state, { payload: customGasPrice }) {
      return {
        ...state,
        txFeeCalculation: { ...state.txFeeCalculation, customGasPrice },
      };
      // TODO question: should recalculate fees too?
    },
    setGasPriceSettingsMode(state, { payload: mode }) {
      return {
        ...state,
        txFeeCalculation: { ...state.txFeeCalculation, gasPriceSettingsMode: mode },
      };
    },
    selectSwapMethod(state, { payload: selectedMethod }) {
      console.log('Selected swap method:', selectedMethod);
      return {
        ...state,
        selectedMethod,
      };
    },
  },
  extraReducers: (user) => {
    user.addCase(updateQuote.pending, (state, action) => {
      state.loadingQuote = 'pending';
      state.lastQuoteCallId = action.meta.arg.updateId;
      console.log('PENDING UPDATE QUOTE');
    });
    user.addCase(updateQuote.fulfilled, (state, action) => {
      if (state.lastQuoteCallId !== action.meta.arg.updateId) {
        console.log(`QUOTE REQUEST WITH ID ${action.meta.arg.updateId} WAS INVALIDATED`);
        return;
      }
      state.swapData = action.payload;
      state.lastQuoteUpdateTimestamp = performance.now();
      state.loadingQuote = 'succeeded';
      state.txFees = calculateRoughFees(action.payload, state.txFeeCalculation.gasPriceInfo.price);
      console.log('UPDATE QUOTE FULFILLED');
    });
    user.addCase(updateQuote.rejected, (state, action) => {
      state.loadingQuote = 'idle';
      state.quoteError = action.payload;
      console.error(action.payload);
      console.log('UPDATE QUOTE REJECTED');
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
  setGasPriceInfo,
  setCustomGasPrice,
  setGasPriceSettingsMode,
  selectSwapMethod,
} = swapSlice.actions;

const { reducer } = swapSlice;

export default reducer;
