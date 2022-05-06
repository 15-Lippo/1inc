import { configureStore } from '@reduxjs/toolkit';
import { load, save } from 'redux-localstorage-simple';

import approveReducer from './state/approve/approveSlice';
import healthcheckReducer from './state/healthcheck/healthcheckSlice';
import swapReducer from './state/swap/swapSlice';
import tokensReducer from './state/tokens/tokensSlice';
import userReducer from './state/user/userSlice';
// import wallet from './wallet/reducer';
// import transactions from './transactions/reducer';

const PERSISTED_KEYS: string[] = ['user', 'transactions'];

const store = configureStore({
  reducer: {
    approve: approveReducer,
    healthcheck: healthcheckReducer,
    user: userReducer,
    swap: swapReducer,
    tokens: tokensReducer,
    // wallet,
    // transactions,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true }).concat(save({ states: PERSISTED_KEYS, debounce: 1000 })),
  preloadedState: load({
    states: PERSISTED_KEYS,
  }),
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
