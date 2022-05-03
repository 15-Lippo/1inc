import { AbstractConnector } from '@web3-react/abstract-connector';
import { InjectedConnector } from '@web3-react/injected-connector';

import { ALL_SUPPORTED_CHAIN_IDS } from './chains';

interface WalletInfo {
  connector?: AbstractConnector;
  name: string;
  mobileOnly?: true;
}

export const injected = new InjectedConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
});

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
  },
};
