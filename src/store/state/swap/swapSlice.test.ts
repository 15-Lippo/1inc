import reducer, { Field, selectCurrency, switchCurrencies, typeInput } from './swapSlice';
import { initialState as swapInitialState } from './swapSlice';

export const initialState = swapInitialState;
const restValues = {
  loading: 'idle',
  error: null,
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
      [Field.OUTPUT]: { currencyId: null },
      [Field.INPUT]: { currencyId: null },
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
      [Field.OUTPUT]: { currencyId: null },
      [Field.INPUT]: { currencyId: null },
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
          currencyId: '0x0000',
        })
      )
    ).toEqual({
      [Field.OUTPUT]: { currencyId: '0x0000' },
      [Field.INPUT]: { currencyId: null },
      typedValue: '',
      independentField: Field.INPUT,
      recipient: null,
      ...restValues,
    });
  });

  it('switchCurrencies', () => {
    expect(reducer(initialState, switchCurrencies())).toEqual({
      [Field.OUTPUT]: { currencyId: null },
      [Field.INPUT]: { currencyId: null },
      typedValue: '',
      independentField: Field.OUTPUT,
      recipient: null,
      ...restValues,
    });
  });

  it('selectCurrency in both fields', () => {
    const previousState = {
      [Field.OUTPUT]: { currencyId: null },
      [Field.INPUT]: { currencyId: '0x0000' },
      typedValue: '',
      independentField: Field.INPUT,
      recipient: null,
    };

    expect(
      reducer(
        previousState,
        selectCurrency({
          field: Field.OUTPUT,
          currencyId: '0x1111',
        })
      )
    ).toEqual({
      OUTPUT: { currencyId: '0x1111' },
      INPUT: { currencyId: '0x0000' },
      typedValue: '',
      independentField: 'INPUT',
      recipient: null,
    });
  });

  it('switchCurrencies', () => {
    const previousState = {
      [Field.OUTPUT]: { currencyId: '0x1111' },
      [Field.INPUT]: { currencyId: '0x0000' },
      typedValue: '',
      independentField: Field.INPUT,
      recipient: null,
      ...restValues,
    };
    // @ts-ignore
    expect(reducer(previousState, switchCurrencies())).toEqual({
      OUTPUT: { currencyId: '0x0000' },
      INPUT: { currencyId: '0x1111' },
      typedValue: '',
      independentField: 'OUTPUT',
      recipient: null,
      ...restValues,
    });
  });
});
