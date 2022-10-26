import type { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';

import { ErrorCode, getNetworkConfig } from '../constants';
import { SupportedChainId } from '../types';
import { toHex } from '../utils';
import useConnectors from './web3/useConnectors';
import useJsonRpcUrlsMap from './web3/useJsonRpcUrlsMap';

async function addChain(provider: Web3Provider, chainId: SupportedChainId, rpcUrls: string[]): Promise<void> {
  const { chainName, nativeCurrency, blockExplorerUrls } = getNetworkConfig(chainId);
  const addChainParameter = {
    chainId: toHex(chainId),
    chainName,
    nativeCurrency,
    blockExplorerUrls,
  };

  for (const rpcUrl of rpcUrls) {
    try {
      await provider.send('wallet_addEthereumChain', [{ ...addChainParameter, rpcUrls: [rpcUrl] }]); // EIP-3085
    } catch (error) {
      if (error?.code !== ErrorCode.USER_REJECTED_REQUEST) continue;
      throw error;
    }
  }
}

async function switchChain(provider: Web3Provider, chainId: SupportedChainId, rpcUrls: string[] = []): Promise<void> {
  try {
    await provider.send('wallet_switchEthereumChain', [{ chainId: toHex(chainId) }]); // EIP-3326 (used by MetaMask)
  } catch (error) {
    if ((error?.code === ErrorCode.CHAIN_NOT_ADDED || ErrorCode.CHAIN_NOT_ADDED_MOBILE_APP) && rpcUrls.length) {
      await addChain(provider, chainId, rpcUrls);
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
      try {
        try {
          // A custom Connector may use a customProvider, in which case it should handle its own chain switching.
          if (!provider) throw new Error();
          // if (connector !== connectors?.metaMask)

          await Promise.all([
            // Await both the user action (switchChain) and its result (chainChanged)
            // so that the callback does not resolve before the chain switch has visibly occured.
            new Promise((resolve) => provider.once('chainChanged', resolve)),
            switchChain(provider, chainId, urlMap[chainId]),
          ]);
        } catch (error) {
          connector === connectors?.network && (await connector.activate(chainId));

          if (error?.code === ErrorCode.USER_REJECTED_REQUEST) return;
          await connector.activate(chainId);
        }
      } catch (error) {
        throw new Error(`Failed to switch network: ${error}`);
      }
    },
    [connector, provider, urlMap]
  );
}
