import { AbstractConnector } from '@web3-react/abstract-connector';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';

import { injected, SUPPORTED_WALLETS } from '../constants/supportedWalles';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useCountdownQuote } from '../store/state/swap/hooks';
import { useAllTokenBalances } from '../store/state/tokens/hooks';
import { fetchTokens } from '../store/state/tokens/tokensSlice';

export default function WalletConnect() {
  const dispatch = useAppDispatch();
  const { account, activate } = useWeb3React();
  const [pendingError, setPendingError] = useState<boolean>();
  const quoteState = useAppSelector((state) => state.swap.quoteInfo);
  const countdownQuote = useCountdownQuote();

  const getTokens = () => {
    // @ts-ignore
    dispatch(fetchTokens());
  };

  useEffect(() => {
    getTokens();
  }, []);

  useAllTokenBalances();

  const tryConnectWallet = async (connector: AbstractConnector) => {
    try {
      await activate(connector, undefined, true);
    } catch (error) {
      if (error) {
        await activate(connector);
      } else {
        setPendingError(true);
      }
    }
  };

  // get wallets user can switch
  function getWalletOptions() {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask;
    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = SUPPORTED_WALLETS[key];

      // overwrite injected when needed
      if (option.connector === injected) {
        // install metamask if there is no
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return (
              <a id={`connect-${key}`} key={key} href={'https://metamask.io/'}>
                Install Metamask
              </a>
            );
          } else {
            return null; //dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null;
        } else if (option.name === 'Injected' && isMetamask) {
          return null;
        }
      }
      // return rest of options
      return (
        !option.mobileOnly && (
          <div
            id={`connect-${key}`}
            onClick={() => {
              // @ts-ignore
              tryConnectWallet(option.connector);
            }}
            key={key}>
            {option.name}
          </div>
        )
      );
    });
  }

  return (
    <>
      <div>Account: {account}</div>
      <div>Click on Supported Wallet: {getWalletOptions()}</div>
      <div>{pendingError}</div>
      <div>
        <b>Quote:</b>
        <div>Update in {countdownQuote} sec</div>
        <div>To Token Amount: {quoteState?.toTokenAmount}</div>
        <div>From Token Amount: {quoteState?.fromTokenAmount}</div>
      </div>
    </>
  );
}
