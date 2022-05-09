import './App.css';

import React, { useEffect } from 'react';

import WalletConnect from './components/WalletConnect';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { Field, selectCurrency } from './store/state/swap/swapSlice';

function App() {
  const dispatch = useAppDispatch();
  const tokensList = useAppSelector((state) => state.tokens.tokensList);

  const setDefaultTokens = () => {
    const inputToken = tokensList.find((i) => i.name.toLowerCase() === 'ethereum');
    const outputToken = tokensList.find((i) => i.name.toLowerCase() === '1inch token');

    dispatch(selectCurrency({ currency: inputToken, field: Field.INPUT }));
    dispatch(selectCurrency({ currency: outputToken, field: Field.OUTPUT }));
  };

  useEffect(() => {
    if (tokensList.length) setDefaultTokens();
  }, [tokensList]);

  return (
    <div className="App">
      <WalletConnect />
    </div>
  );
}

export default App;
