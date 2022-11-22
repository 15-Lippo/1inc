import { EIP1193 } from '@web3-react/eip1193';
import { MetaMask } from '@web3-react/metamask';
import { Network } from '@web3-react/network';
import { createContext, PropsWithChildren, useContext } from 'react';
import React from 'react';

import { invariant, JsonRpcConnector, WalletConnectPopup } from '../../utils';

export interface Connectors {
  user: EIP1193 | JsonRpcConnector | undefined;
  metaMask: MetaMask;
  walletConnect: WalletConnectPopup;
  network: Network;
}

const ConnectorsContext = createContext<Connectors | null>(null);

export function Provider({ connectors, children }: PropsWithChildren<{ connectors: Connectors }>) {
  return <ConnectorsContext.Provider value={connectors}>{children}</ConnectorsContext.Provider>;
}

export default function useConnectors() {
  const connectors = useContext(ConnectorsContext);
  invariant(connectors, 'useConnectors used without initializing the context');
  return connectors;
}
