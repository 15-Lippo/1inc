import './App.css';

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import WalletConnect from './components/WalletConnect';
import { useAllTokenBalances } from './store/state/tokens/hooks';
import { fetchTokens } from './store/state/tokens/tokensSlice';

function App() {
  const dispatch = useDispatch();

  const getTokens = () => {
    // @ts-ignore
    dispatch(fetchTokens());
  };

  useEffect(() => {
    getTokens();
  }, []);

  useAllTokenBalances();

  return (
    <div className="App">
      <WalletConnect />
    </div>
  );
}

export default App;
