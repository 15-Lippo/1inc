import { Field } from '../../../types';
import reducer, { selectCurrency, switchCurrencies, typeInput } from './swapSlice';
import { initialState as swapInitialState } from './swapSlice';

export const initialState = swapInitialState;

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
      ...initialState,
      [Field.OUTPUT]: '',
      [Field.INPUT]: '',
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
      ...initialState,
      [Field.OUTPUT]: '',
      [Field.INPUT]: '',
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
          currency: '0x0000',
        })
      )
    ).toEqual({
      ...initialState,
      [Field.OUTPUT]: '0x0000',
    });
  });

  it('selectCurrency in both fields', () => {
    const previousState = {
      ...initialState,
      [Field.OUTPUT]: '',
      [Field.INPUT]: '0x0000',
      typedValue: '',
      independentField: Field.INPUT,
      recipient: null,
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
      ...initialState,
      OUTPUT: '0x1111',
      INPUT: '0x0000',
      typedValue: '',
      independentField: 'INPUT',
      recipient: null,
    });
  });

  it('switchCurrencies', () => {
    const previousState = {
      ...initialState,
      [Field.OUTPUT]: '0x1111',
      [Field.INPUT]: '0x0000',
      typedValue: '',
      independentField: Field.INPUT,
      recipient: null,
    };
    // @ts-ignore
    expect(reducer(previousState, switchCurrencies())).toEqual({
      ...initialState,
      OUTPUT: '0x0000',
      INPUT: '0x1111',
      typedValue: '',
      independentField: 'OUTPUT',
      recipient: null,
    });
  });
});
