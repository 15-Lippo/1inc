import { Field } from '../../../types';
import reducer, { selectCurrency, setSlippage, switchCurrencies, typeInput } from '../swap/swapSlice';
import { initialState as swapInitialState, setTxFee } from './swapSlice';

export const initialState = swapInitialState;

describe('swapSlice', () => {
  it('set slippage', () => {
    const slippage = 11;
    expect(
      reducer(
        initialState,
        setSlippage({
          percent: slippage,
        })
      )
    ).toEqual({
      ...initialState,
      slippage,
    });
  });

  it('initial state of typeInput', () => {
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
    });
  });

  it('typeInput 1000 in INPUT field', () => {
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
    });
  });

  it('switchCurrencies', () => {
    const previousState = {
      ...initialState,
      [Field.OUTPUT]: '0x1111',
      [Field.INPUT]: '0x0000',
      typedValue: '',
      independentField: Field.INPUT,
    };
    // @ts-ignore
    expect(reducer(previousState, switchCurrencies())).toEqual({
      ...initialState,
      OUTPUT: '0x0000',
      INPUT: '0x1111',
      typedValue: '',
      independentField: 'OUTPUT',
    });
  });
  it('set tx fee', () => {
    const fee = '1000';
    expect(reducer(initialState, setTxFee(fee))).toEqual({
      ...initialState,
      txFeeCalculation: {
        ...initialState.txFeeCalculation,
        txFee: fee,
      },
    });
  });
});
