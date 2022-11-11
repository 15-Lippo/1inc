import { formatUnits, parseUnits } from '@ethersproject/units';
import { Dispatch, Middleware } from '@reduxjs/toolkit';

import { Field } from '../types';
import { selectCurrency, switchCurrencies, typeInput } from './state';
import { AppState } from './store';

const updateDecimalsForTypedValue = (state: AppState, dispatch: Dispatch, newDecimals: number) => {
  const currentDecimals = state.tokens.tokens[state.swap[Field.INPUT]]?.decimals;
  if (!isNaN(currentDecimals) && !isNaN(newDecimals) && currentDecimals !== newDecimals) {
    const recalculatedTypedValue = parseUnits(formatUnits(state.swap.typedValue, currentDecimals), newDecimals);
    dispatch(typeInput({ field: Field.INPUT, typedValue: recalculatedTypedValue.toString() }));
  }
};

export const recalculateTypedValueOnSelectCurrency: Middleware =
  ({ getState, dispatch }) =>
  (next) =>
  (action) => {
    if (action.type === selectCurrency.type && action.payload.field === Field.INPUT) {
      const state = getState();
      const newDecimals = state.tokens.tokens[action.payload.currency]?.decimals;
      updateDecimalsForTypedValue(state, dispatch, newDecimals);
    }
    next(action);
  };

export const recalculateTypedValueOnSwitchCurrency: Middleware =
  ({ getState, dispatch }) =>
  (next) =>
  (action) => {
    if (action.type === switchCurrencies.type) {
      const state = getState();
      const newDecimals = state.tokens.tokens[state.swap[Field.OUTPUT]]?.decimals;
      updateDecimalsForTypedValue(state, dispatch, newDecimals);
    }
    next(action);
  };
