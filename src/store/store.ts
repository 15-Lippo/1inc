import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { load, save } from 'redux-localstorage-simple';

import {
  approveReducer,
  healthcheckReducer,
  recalculateTypedValueOnSelectCurrency,
  recalculateTypedValueOnSwitchCurrency,
  swapReducer,
  tokensReducer,
  txReducer,
  userReducer,
} from '.';

const PERSISTED_KEYS: string[] = ['user', 'transactions'];

const rootReducer = combineReducers({
  approve: approveReducer,
  healthcheck: healthcheckReducer,
  user: userReducer,
  swap: swapReducer,
  tokens: tokensReducer,
  // wallet,
  transactions: txReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true })
      .concat(save({ states: PERSISTED_KEYS, debounce: 1000 }))
      .concat(recalculateTypedValueOnSelectCurrency)
      .concat(recalculateTypedValueOnSwitchCurrency),

  preloadedState: load({
    states: PERSISTED_KEYS,
  }),
});

export default store;

//export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
