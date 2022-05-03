import reducer, {
  Field,
  selectCurrency,
  SwapState,
  switchCurrencies,
  typeInput,
} from './swapSlice';

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
    });
  });

  it('switchCurrencies', () => {
    expect(reducer(initialState, switchCurrencies())).toEqual({
      [Field.OUTPUT]: { currencyId: null },
      [Field.INPUT]: { currencyId: null },
      typedValue: '',
      independentField: Field.OUTPUT,
      recipient: null,
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
    };
    expect(reducer(previousState, switchCurrencies())).toEqual({
      OUTPUT: { currencyId: '0x0000' },
      INPUT: { currencyId: '0x1111' },
      typedValue: '',
      independentField: 'OUTPUT',
      recipient: null,
    });
  });
});
