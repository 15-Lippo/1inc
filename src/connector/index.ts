import type { Web3Provider } from '@ethersproject/providers';
import { getPriorityConnector } from '@web3-react/core';

import metaMask from './metaMask';

export type { Web3Connector } from './utils';

export function useActiveProvider(): Web3Provider | undefined {
  // ~ Possible to add to getPriorityConnector one more connector. Like [metaMask, walletConnect] and etc.
  return getPriorityConnector([...metaMask]).usePriorityProvider() as Web3Provider;
}
