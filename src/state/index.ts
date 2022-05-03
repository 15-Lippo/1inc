import { configureStore } from '@reduxjs/toolkit';
import { load, save } from 'redux-localstorage-simple';

import swap from './swap/reducer';
import user from './user/reducer';
// import wallet from './wallet/reducer';
// import transactions from './transactions/reducer';

const PERSISTED_KEYS: string[] = ['user', 'transactions'];

const store = configureStore({
  reducer: {
    user,
    // wallet,
    // transactions,
    swap,
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
