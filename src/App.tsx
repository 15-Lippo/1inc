import './App.css';

import { useWeb3React } from '@web3-react/core';
import React, { useEffect } from 'react';

import MainButton, { MainButtonType } from './components/Buttons/MainButton';
import RefreshQuoteButton from './components/Buttons/RefreshQuoteButton';
import GetBox from './components/GetBox';
import SendBox from './components/SendBox';
import SwapButton from './components/SwapButton';
import WalletConnect from './components/WalletConnect';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { ApproveStatus } from './store/state/approve/approveSlice';
import { useApproval } from './store/state/approve/hooks';
import { Field, selectCurrency } from './store/state/swap/swapSlice';
import { useTokens } from './store/state/tokens/useTokens';

export interface IWidgetProps {
  defaultInput: string;
  defaultOutput: string;
}

function App() {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const { addresses } = useTokens();
  const { status, approve } = useApproval();
  const { INPUT, OUTPUT } = useAppSelector((state) => state.swap);

  useEffect(() => {
    const setDefaultTokens = () => {
      const input = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
      const output = '0x111111111117dc0aa78b770fa6a738034120c302';

      if (input) dispatch(selectCurrency({ currency: input, field: Field.INPUT }));
      if (output) dispatch(selectCurrency({ currency: output, field: Field.OUTPUT }));
    };

    if (!addresses.length) return;
    if (INPUT && OUTPUT) return;
    console.log('set default tokens ...');
    setDefaultTokens();
  }, [addresses.length, INPUT, OUTPUT]);

  const onApprove = async () => {
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
      {addresses.length && (
        <>
          <SendBox />
          <GetBox />
          {status === ApproveStatus.APPROVAL_NEEDED && (
            <MainButton type={MainButtonType.Approve} onClick={onApprove} />
          )}
        </>
      )}
      {!account && <WalletConnect />}
      <SwapButton />
    </div>
  );
}

export default App;
