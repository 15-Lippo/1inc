import './App.css';

import React, { useEffect } from 'react';

import WalletConnect from './components/WalletConnect';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { ApproveStatus, fetchApproveSpender } from './store/state/approve/approveSlice';
import { useApproval, useCheckApproveState } from './store/state/approve/hooks';
import { Field, selectCurrency } from './store/state/swap/swapSlice';

function App() {
  const dispatch = useAppDispatch();
  const tokensList = useAppSelector((state) => state.tokens.tokensList);
  const { INPUT, OUTPUT } = useAppSelector((state) => state.swap);
  const { status } = useAppSelector((state) => state.approve.approveAllowanceInfo);
  const [, approve] = useApproval();

  const setDefaultTokens = () => {
    const outputToken = tokensList.find((i) => i.name.toLowerCase() === 'ethereum');
    const inputToken = tokensList[15]; ///.find((i) => i.name === 'Tellor Tributes');

    dispatch(selectCurrency({ currency: inputToken, field: Field.INPUT }));
    dispatch(selectCurrency({ currency: outputToken, field: Field.OUTPUT }));
  };

  useEffect(() => {
    dispatch(fetchApproveSpender());
    if (tokensList.length) {
      setDefaultTokens();
    }
  }, [tokensList.length]);

  useCheckApproveState();

  const onApprove = async () => {
    console.log('APPROVING...');
    await approve();
  };

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
          <div>Send: {INPUT.currency.symbol}</div>
          <div>Get: {OUTPUT.currency.symbol}</div>
          <hr />
          Approve Status: {status}
          {status === ApproveStatus.NOT_APPROVED && (
            <button onClick={onApprove}>Approve token</button>
          )}
        </>
      )}
    </div>
  );
}

export default App;
