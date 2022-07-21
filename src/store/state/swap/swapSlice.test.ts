import { Field } from '../../../types';
import reducer, { selectCurrency, switchCurrencies, typeInput } from './swapSlice';
import { initialState as swapInitialState } from './swapSlice';

export const initialState = swapInitialState;
const restValues = {
  loading: 'idle',
  loadingQuote: 'idle',
  txFeeCalculation: {
    gasPriceInfo: {
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
    gasLimit: '130000',
    maxFeePerGas: '',
    txFee: '',
  },
  slippage: 1,
  quoteError: null,
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
  referrerOptions: {
    referrerAddress: '',
    fee: '',
  },
  lastQuoteUpdateTimestamp: -1,
};
describe('swapSlice', () => {
  it('typeInput 0.1 in OUTPUT field', () => {
    return expect(
      reducer(undefined, {
        type: undefined,
      })
    ).toEqual(initialState);
  });

  it('typeInput 0.1 in OUTPUT field', () => {
    const typedValue = '0.1';
    expect(
      reducer(
        initialState,
        typeInput({
          field: Field.OUTPUT,
          typedValue,
        })
      )
    ).toEqual({
      [Field.OUTPUT]: '',
      [Field.INPUT]: '',
      typedValue,
      independentField: Field.OUTPUT,
      recipient: null,
      ...restValues,
    });
  });

  it('ypeInput 1000 in INPUT field', () => {
    const typedValue = '1000';
    expect(
      reducer(
        initialState,
        typeInput({
          field: Field.INPUT,
          typedValue,
        })
      )
    ).toEqual({
      [Field.OUTPUT]: '',
      [Field.INPUT]: '',
      typedValue,
      independentField: Field.INPUT,
      recipient: null,
      ...restValues,
    });
  });

  it('selectCurrency OUTPUT', () => {
    expect(
      reducer(
        initialState,
        selectCurrency({
          field: Field.OUTPUT,
          currency: '0x0000',
        })
      )
    ).toEqual({
      [Field.OUTPUT]: '0x0000',
      [Field.INPUT]: '',
      typedValue: '',
      independentField: Field.INPUT,
      recipient: null,
      ...restValues,
    });
  });

  it('switchCurrencies', () => {
    expect(reducer(initialState, switchCurrencies())).toEqual({
      [Field.OUTPUT]: '',
      [Field.INPUT]: '',
      typedValue: '',
      independentField: Field.OUTPUT,
      recipient: null,
      ...restValues,
    });
  });

  it('selectCurrency in both fields', () => {
    const previousState = {
      [Field.OUTPUT]: '',
      [Field.INPUT]: '0x0000',
      typedValue: '',
      independentField: Field.INPUT,
      recipient: null,
      ...restValues,
    };

    expect(
      reducer(
        // @ts-ignore
        previousState,
        selectCurrency({
          field: Field.OUTPUT,
          currency: '0x1111',
        })
      )
    ).toEqual({
      OUTPUT: '0x1111',
      INPUT: '0x0000',
      typedValue: '',
      independentField: 'INPUT',
      recipient: null,
      ...restValues,
    });
  });

  it('switchCurrencies', () => {
    const previousState = {
      [Field.OUTPUT]: '0x1111',
      [Field.INPUT]: '0x0000',
      typedValue: '',
      independentField: Field.INPUT,
      recipient: null,
      ...restValues,
    };
    // @ts-ignore
    expect(reducer(previousState, switchCurrencies())).toEqual({
      OUTPUT: '0x0000',
      INPUT: '0x1111',
      typedValue: '',
      independentField: 'OUTPUT',
      recipient: null,
      ...restValues,
    });
  });
});
