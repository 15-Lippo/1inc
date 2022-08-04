import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { load, save } from 'redux-localstorage-simple';

import { recalculateTypedValueOnSelectCurrency, recalculateTypedValueOnSwitchCurrency } from './custom-middleware';
import approveReducer from './state/approve/approveSlice';
import healthcheckReducer from './state/healthcheck/healthcheckSlice';
import swapReducer from './state/swap/swapSlice';
import tokensReducer from './state/tokens/tokensSlice';
import txReducer from './state/transactions/txSlice';
import userReducer from './state/user/userSlice';

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
