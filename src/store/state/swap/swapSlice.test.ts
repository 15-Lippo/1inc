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
      [Field.OUTPUT]: {
        currency: {
          symbol: '',
          name: '',
          address: '',
          decimals: 0,
          logoURI: '',
          tokenAmount: '0',
        },
      },
      [Field.INPUT]: {
        currency: {
          symbol: '',
          name: '',
          address: '',
          decimals: 0,
          logoURI: '',
          tokenAmount: '0',
        },
      },
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
      [Field.OUTPUT]: {
        currency: {
          symbol: '',
          name: '',
          address: '',
          decimals: 0,
          logoURI: '',
          tokenAmount: '0',
        },
      },
      [Field.INPUT]: {
        currency: {
          symbol: '',
          name: '',
          address: '',
          decimals: 0,
          logoURI: '',
          tokenAmount: '0',
        },
      },
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
          currency: {
            symbol: 'AAA',
            name: 'AAA Token',
            address: '0x0000',
            decimals: 18,
            logoURI: 'https://tokens.1inch.io/0x0000.png',
            tokenAmount: '1',
          },
        })
      )
    ).toEqual({
      [Field.OUTPUT]: {
        currency: {
          symbol: 'AAA',
          name: 'AAA Token',
          address: '0x0000',
          decimals: 18,
          logoURI: 'https://tokens.1inch.io/0x0000.png',
          tokenAmount: '1',
        },
      },
      [Field.INPUT]: {
        currency: {
          symbol: '',
          name: '',
          address: '',
          decimals: 0,
          logoURI: '',
          tokenAmount: '0',
        },
      },
      typedValue: '',
      independentField: Field.INPUT,
      recipient: null,
      ...restValues,
    });
  });

  it('switchCurrencies', () => {
    expect(reducer(initialState, switchCurrencies())).toEqual({
      [Field.OUTPUT]: {
        currency: {
          symbol: '',
          name: '',
          address: '',
          decimals: 0,
          logoURI: '',
          tokenAmount: '0',
        },
      },
      [Field.INPUT]: {
        currency: {
          symbol: '',
          name: '',
          address: '',
          decimals: 0,
          logoURI: '',
          tokenAmount: '0',
        },
      },
      typedValue: '',
      independentField: Field.OUTPUT,
      recipient: null,
      ...restValues,
    });
  });

  it('selectCurrency in both fields', () => {
    const previousState = {
      [Field.OUTPUT]: {
        currency: {
          symbol: '',
          name: '',
          address: '',
          decimals: 0,
          logoURI: '',
          tokenAmount: '0',
        },
      },
      [Field.INPUT]: {
        currency: {
          symbol: 'AAA',
          name: 'AAA Token',
          address: '0x0000',
          decimals: 18,
          logoURI: 'https://tokens.1inch.io/0x0000.png',
          tokenAmount: '1',
        },
      },
      typedValue: '',
      independentField: Field.INPUT,
      recipient: null,
    };

    expect(
      reducer(
        previousState,
        selectCurrency({
          field: Field.OUTPUT,
          currency: {
            symbol: 'EEE',
            name: 'EEE Token',
            address: '0x1111',
            decimals: 18,
            logoURI: 'https://tokens.1inch.io/0x1111.png',
            tokenAmount: '1',
          },
        })
      )
    ).toEqual({
      OUTPUT: {
        currency: {
          symbol: 'EEE',
          name: 'EEE Token',
          address: '0x1111',
          decimals: 18,
          logoURI: 'https://tokens.1inch.io/0x1111.png',
          tokenAmount: '1',
        },
      },
      INPUT: {
        currency: {
          symbol: 'AAA',
          name: 'AAA Token',
          address: '0x0000',
          decimals: 18,
          logoURI: 'https://tokens.1inch.io/0x0000.png',
          tokenAmount: '1',
        },
      },
      typedValue: '',
      independentField: 'INPUT',
      recipient: null,
    });
  });

  it('switchCurrencies', () => {
    const previousState = {
      [Field.OUTPUT]: { currency: '0x1111' },
      [Field.INPUT]: { currency: '0x0000' },
      typedValue: '',
      independentField: Field.INPUT,
      recipient: null,
      ...restValues,
    };
    // @ts-ignore
    expect(reducer(previousState, switchCurrencies())).toEqual({
      OUTPUT: { currency: '0x0000' },
      INPUT: { currency: '0x1111' },
      typedValue: '',
      independentField: 'OUTPUT',
      recipient: null,
      ...restValues,
    });
  });
});
