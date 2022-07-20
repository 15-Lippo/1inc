import { Web3Provider } from '@ethersproject/providers';
import { getPriorityConnector } from '@web3-react/core';

import metaMask from './metaMask';

// constants
export const connectors = [metaMask];

export function useActiveProvider(): Web3Provider | undefined {
  // ~ Possible to add to getPriorityConnector one more connector. Like [metaMask, walletConnect] and etc.
  // @ts-ignore
  return getPriorityConnector([...metaMask]).usePriorityProvider() as Web3Provider;
}
