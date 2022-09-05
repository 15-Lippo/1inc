import { AddEthereumChainParameter, Connector } from '@web3-react/types';

import { networkConfigs, RPC_URLS } from '../constants';
import { SupportedChainId } from '../types';

export const switchNetwork = async (connector: Connector, chainId: SupportedChainId, account: string | undefined) => {
  if (!connector) return;

  if (!account) {
    await connector.activate(chainId);
  } else {
    try {
      const network = networkConfigs[chainId];
      const addChainParameter: AddEthereumChainParameter = {
        chainId,
        chainName: network.chainName,
        rpcUrls: [RPC_URLS[chainId]],
        // @ts-ignore
        nativeCurrency: network.nativeCurrency,
        blockExplorerUrls: network.blockExplorerUrls,
      };
      await connector.activate(addChainParameter);
    } catch (error) {
      return console.error('Network switched but with an error:', error);
    }
  }
};
