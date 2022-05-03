import { createReducer } from '@reduxjs/toolkit';

import { Field, selectCurrency, switchCurrencies, typeInput } from './actions';

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
};

export default createReducer<SwapState>(initialState, (builder) =>
  builder
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT;
      if (currencyId === state[otherField].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [field]: { currencyId },
          [otherField]: { currencyId: state[field].currencyId },
        };
      } else {
        // the normal case
        return {
          ...state,
          [field]: { currencyId },
        };
      }
    })
    .addCase(switchCurrencies, (state) => {
      return {
        ...state,
        independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        [Field.INPUT]: { currencyId: state[Field.OUTPUT].currencyId },
        [Field.OUTPUT]: { currencyId: state[Field.INPUT].currencyId },
      };
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue,
      };
    })
);
