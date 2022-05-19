import './App.css';

import { makeStyles } from '@mui/styles';
import { useWeb3React } from '@web3-react/core';
import React, { useEffect } from 'react';

import RefreshQuoteButton from './components/Buttons/RefreshQuoteButton';
import GetBox from './components/GetBox';
import SendBox from './components/SendBox';
import WalletConnect from './components/WalletConnect';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { ApproveStatus, fetchApproveSpender } from './store/state/approve/approveSlice';
import { useApproval, useCheckApproveState } from './store/state/approve/hooks';
import { Field, selectCurrency } from './store/state/swap/swapSlice';
import { ITheme, withTheme } from './theme';

const useStyles = makeStyles((theme: ITheme) => ({
  widgetRoot: {
    position: 'relative',
    width: '418px',
    boxShadow: '0px 12px 24px #E2E9F6',
    borderRadius: '24px',
  },
}));

function App() {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const [, approve] = useApproval();
  const classes = useStyles();

  const tokensList = useAppSelector((state) => state.tokens.tokensList);
  const { status } = useAppSelector((state) => state.approve.approveAllowanceInfo);

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
    <div id="widget" className={classes.widgetRoot}>
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
    </div>
  );
}

export default withTheme(App);
