import './App.css';

import React, { useEffect } from 'react';

import WalletConnect from './components/WalletConnect';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { useCheckApproveState } from './store/state/approve/hooks';
import { Field, selectCurrency } from './store/state/swap/swapSlice';

function App() {
  const dispatch = useAppDispatch();
  const tokensList = useAppSelector((state) => state.tokens.tokensList);
  const { INPUT, OUTPUT } = useAppSelector((state) => state.swap);
  const { status } = useAppSelector((state) => state.approve.approveAllowanceInfo);

  const setDefaultTokens = () => {
    const outputToken = tokensList.find((i) => i.name.toLowerCase() === 'ethereum');
    const inputToken = tokensList.find((i) => i.name.toLowerCase() === '1inch token');

    dispatch(selectCurrency({ currency: inputToken, field: Field.INPUT }));
    dispatch(selectCurrency({ currency: outputToken, field: Field.OUTPUT }));
  };

  useEffect(() => {
    if (tokensList.length) {
      setDefaultTokens();
    }
  }, [tokensList.length]);

  // @ts-ignore
  useCheckApproveState();

  return (
    <div className="App">
      <WalletConnect />
      <hr />
      {tokensList && (
        <>
          <div>
            Balance of {INPUT.currency.symbol} in ETHER: {INPUT.currency.tokenAmount || 0}
          </div>
          <div>
            Balance of {OUTPUT.currency.symbol} in ETHER: {OUTPUT.currency.tokenAmount || 0}
          </div>
          <div>
            Send: {INPUT.currency.symbol} with allowance {status}
          </div>
          <div>Get: {OUTPUT.currency.symbol}</div>
        </>
      )}
    </div>
  );
}

export default App;
