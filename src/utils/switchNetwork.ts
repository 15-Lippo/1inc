import { AddEthereumChainParameter, Connector } from '@web3-react/types';

import { networkConfigs } from '../constants';
import { SupportedChainId } from '../types';

export const switchNetwork = async (connector: Connector, chainId: SupportedChainId) => {
  if (!connector) return;
  try {
    const network = networkConfigs[chainId];
    const addChainParameter: AddEthereumChainParameter = {
      chainId,
      chainName: network.chainName,
      rpcUrls: network.rpcUrls,
      // @ts-ignore
      nativeCurrency: network.nativeCurrency,
      blockExplorerUrls: network.blockExplorerUrls,
    };
    await connector.activate(addChainParameter);
  } catch (error) {
    return console.error('Network switched but with an error:', error);
  }
};
