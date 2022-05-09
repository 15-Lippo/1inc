import { render } from '@testing-library/react';
import { Web3ReactProvider } from '@web3-react/core';
import React from 'react';
import { Provider } from 'react-redux';

import App from './App';
import store from './store';
import { getLibrary } from './utils';

test('Renders App', () => {
  render(
    <Provider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <App />
      </Web3ReactProvider>
    </Provider>
  );
});
