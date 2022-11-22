import type { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';

import { ErrorCode, getNetworkConfig } from '../constants';
import { SupportedChainId } from '../types';
import { toHex } from '../utils';
import useConnectors from './web3/useConnectors';
import useJsonRpcUrlsMap from './web3/useJsonRpcUrlsMap';

interface AddEthereumChainParameter {
  chainId: string;
  chainName: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  blockExplorerUrls: [string];
  rpcUrls: string[];
}

async function addChain(provider: Web3Provider, addChainParameter: AddEthereumChainParameter): Promise<void> {
  for (const rpcUrl of addChainParameter.rpcUrls) {
    try {
      await provider.send('wallet_addEthereumChain', [{ ...addChainParameter, rpcUrls: [rpcUrl] }]); // EIP-3085
    } catch (error) {
      if (error?.code !== ErrorCode.USER_REJECTED_REQUEST) continue;
      throw error;
    }
  }
}

async function switchChain(
  provider: Web3Provider,
  chainId: SupportedChainId,
  addChainParameter?: AddEthereumChainParameter
): Promise<void> {
  try {
    await provider.send('wallet_switchEthereumChain', [{ chainId: toHex(chainId) }]); // EIP-3326 (used by MetaMask)
  } catch (error) {
    if (
      (error?.code === ErrorCode.CHAIN_NOT_ADDED || ErrorCode.CHAIN_NOT_ADDED_MOBILE_APP) &&
      addChainParameter?.rpcUrls.length
    ) {
      await addChain(provider, addChainParameter);
      return switchChain(provider, chainId);
    }
    throw error;
  }
}

export default function useSwitchChain(): (chainId: SupportedChainId) => Promise<void> {
  const { connector, provider } = useWeb3React();
  const urlMap = useJsonRpcUrlsMap();
  const connectors = useConnectors();

  return useCallback(
    async (chainId: SupportedChainId) => {
      const { chainName, nativeCurrency, blockExplorerUrls } = getNetworkConfig(chainId);
      const addChainParameter = {
        chainId: toHex(chainId),
        chainName,
        nativeCurrency,
        blockExplorerUrls,
        rpcUrls: urlMap[chainId],
      };

      try {
        if (connector === connectors.network) {
          return await connector.activate(chainId);
        }

        try {
          if (!provider) throw new Error();

          await Promise.all([
            // Await both the user action (switchChain) and its result (chainChanged)
            // so that the callback does not resolve before the chain switch has visibly occured.
            new Promise((resolve) => provider.once('chainChanged', resolve)),
            switchChain(provider, chainId, addChainParameter),
          ]);
        } catch (error) {
          if (error?.code === ErrorCode.USER_REJECTED_REQUEST) return;
          await connector.activate(chainId);
        }
      } catch (error) {
        throw new Error(`Failed to switch network: ${error}`);
      }
    },
    [connector, connectors.network, provider, urlMap]
  );
}
