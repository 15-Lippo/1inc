import { useWeb3React } from '@web3-react/core';
import { EIP1193 } from '@web3-react/eip1193';
import { MetaMask } from '@web3-react/metamask';
import { Network } from '@web3-react/network';
import { createContext, PropsWithChildren, useContext, useEffect } from 'react';
import React from 'react';

import { JsonRpcConnector, WalletConnectPopup } from '../../utils';

export interface Connectors {
  user: EIP1193 | JsonRpcConnector | undefined;
  metaMask: MetaMask;
  walletConnect: WalletConnectPopup;
  network: Network;
}

const ConnectorsContext = createContext<Connectors | null>(null);

export function Provider({ connectors, children }: PropsWithChildren<{ connectors: Connectors }>) {
  const { chainId, connector } = useWeb3React();

  useEffect(() => {
    if (connector !== connectors.network) {
      connectors.network.activate(chainId);
    }
  }, [chainId, connector, connectors.network]);

  return <ConnectorsContext.Provider value={connectors}>{children}</ConnectorsContext.Provider>;
}

export default function useConnectors() {
  return useContext(ConnectorsContext);
}
