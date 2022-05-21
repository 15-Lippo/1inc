import './App.css';

import { useWeb3React } from '@web3-react/core';
import React, { useEffect } from 'react';

import RefreshQuoteButton from './components/Buttons/RefreshQuoteButton';
import GetBox from './components/GetBox';
import SendBox from './components/SendBox';
import SwapButton from './components/SwapButton';
import WalletConnect from './components/WalletConnect';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { ApproveStatus, fetchApproveSpender } from './store/state/approve/approveSlice';
import { useApproval, useCheckApproveState } from './store/state/approve/hooks';
import { Field, selectCurrency } from './store/state/swap/swapSlice';
import { useBalancesCallback } from './store/state/tokens/useBalancesCallback';

function App() {
  const dispatch = useAppDispatch();
  const { account, chainId, library } = useWeb3React();
  const [, approve] = useApproval();
  const balancesCallback = useBalancesCallback();

  const tokensList = useAppSelector((state) => state.tokens.tokensList);
  const { status } = useAppSelector((state) => state.approve.approveAllowanceInfo);

  const setDefaultTokens = () => {
    const inputToken = tokensList.find((i) => i.name.toLowerCase() === 'ethereum');
    const outputToken = tokensList.find((i) => i.name.toLowerCase() === '1inch token');

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

  useEffect(() => {
    if (tokensList.length) {
      try {
        balancesCallback();
      } catch (error) {
        console.error(error);
      }
    }
  }, [account, tokensList.length, library, chainId]);

  const onApprove = async () => {
    console.log('APPROVING...');
    await approve();
  };

  return (
    <div
      id="widget"
      style={{
        position: 'relative',
        width: '418px',
        boxShadow: '0px 12px 24px #E2E9F6',
        borderRadius: '24px',
      }}>
      <RefreshQuoteButton />
      <div>Account: {account}</div>
      {tokensList && (
        <>
          <SendBox />
          <GetBox />
          {status === ApproveStatus.NOT_APPROVED && (
            <button onClick={onApprove}>Approve token</button>
          )}
        </>
      )}
      {!account && <WalletConnect />}
      <SwapButton />
    </div>
  );
}

export default App;
