import { ExternalProvider, JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { initializeConnector, Web3ReactHooks } from '@web3-react/core';
import { EIP1193 } from '@web3-react/eip1193';
import { EMPTY } from '@web3-react/empty';
import { Network } from '@web3-react/network';
import { Connector, Provider as Eip1193Provider } from '@web3-react/types';
import _ from 'lodash';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo } from 'react';
import React from 'react';

import { DefaultRpcJsonEndpoint } from '../../types';
import { JsonRpcConnector } from '.';

type Web3ContextType = {
  connector: Connector;
  library?: (JsonRpcProvider & { provider?: ExternalProvider }) | Web3Provider;
  chainId?: ReturnType<Web3ReactHooks['useChainId']>;
  accounts?: ReturnType<Web3ReactHooks['useAccounts']>;
  account?: ReturnType<Web3ReactHooks['useAccount']>;
  active?: ReturnType<Web3ReactHooks['useIsActive']>;
  activating?: ReturnType<Web3ReactHooks['useIsActivating']>;
  error?: ReturnType<Web3ReactHooks['useError']>;
};

// @ts-ignore
const [EMPTY_CONNECTOR, EMPTY_HOOKS] = initializeConnector<Connector>(() => EMPTY);
const EMPTY_STATE = { connector: EMPTY_CONNECTOR, hooks: EMPTY_HOOKS };
// @ts-ignore
const EMPTY_CONTEXT: Web3ContextType = { connector: EMPTY };
const Web3Context = createContext(EMPTY_CONTEXT);

// use this hook to get ActiveWeb3Provider context (active, chainId, account etc.)
export function useActiveWeb3React() {
  return useContext(Web3Context);
}

interface ActiveWeb3ProviderProps {
  jsonRpcEndpoint?: DefaultRpcJsonEndpoint;
  provider?: Eip1193Provider | JsonRpcProvider;
}

export function ActiveWeb3Provider({
  jsonRpcEndpoint,
  provider,
  children,
}: PropsWithChildren<ActiveWeb3ProviderProps>) {
  const network = useMemo(() => {
    if (!_.isEmpty(jsonRpcEndpoint)) {
      const [connector, hooks] = initializeConnector(
        // @ts-ignore
        (actions) => new Network({ actions, urlMap: jsonRpcEndpoint, defaultChainId: 1 })
      );
      connector.activate();
      return { connector, hooks };
    }
    return EMPTY_STATE;
  }, [jsonRpcEndpoint]);

  const wallet = useMemo(() => {
    if (provider) {
      let connector, hooks;
      if (JsonRpcProvider.isProvider(provider)) {
        // @ts-ignore
        [connector, hooks] = initializeConnector((actions) => new JsonRpcConnector(actions, provider));
      } else if (JsonRpcProvider.isProvider((provider as any).provider)) {
        throw new Error('Eip1193Bridge is experimental: pass your ethers Provider directly');
      } else {
        // @ts-ignore
        [connector, hooks] = initializeConnector((actions) => new EIP1193(actions, provider));
      }
      connector.activate();
      return { connector, hooks };
    }
    return EMPTY_STATE;
  }, [provider]);

  const { connector, hooks } = wallet.hooks.useIsActive() || network === EMPTY_STATE ? wallet : network;
  const accounts = hooks.useAccounts();
  const account = hooks.useAccount();
  const activating = hooks.useIsActivating();
  const active = hooks.useIsActive();
  const chainId = hooks.useChainId();
  const error = hooks.useError();
  const library = hooks.useProvider({ name: 'wallet', chainId: chainId! });
  const web3 = useMemo(() => {
    // @ts-ignore
    if (connector === EMPTY || !(active || activating)) {
      return EMPTY_CONTEXT;
    }
    return { connector, library, chainId, accounts, account, active, activating, error };
  }, [account, accounts, activating, active, chainId, connector, error, library]);

  // Log web3 errors to facilitate debugging.
  useEffect(() => {
    if (error) {
      console.error('web3 error:', error);
    }
  }, [error]);

  // @ts-ignore
  return <Web3Context.Provider value={web3}>{children}</Web3Context.Provider>;
}
