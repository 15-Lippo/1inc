import { JsonRpcProvider, StaticJsonRpcProvider } from '@ethersproject/providers';
import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react';

import { JSON_RPC_ENDPOINTS } from '../../constants';
import { SupportedChainId } from '../../types';

export type JsonRpcConnectionMap = { [chainId: number]: string | string[] | JsonRpcProvider | JsonRpcProvider[] };

const JsonRpcUrlMapContext = createContext<JsonRpcConnectionMap | undefined>(undefined);

export function Provider({ jsonRpcMap, children }: PropsWithChildren<{ jsonRpcMap?: JsonRpcConnectionMap }>) {
  return <JsonRpcUrlMapContext.Provider value={jsonRpcMap}>{children}</JsonRpcUrlMapContext.Provider>;
}

export default function useJsonRpcUrlsMap(): Record<SupportedChainId, string[]> {
  const jsonRpcMap = useContext(JsonRpcUrlMapContext);
  return useMemo(() => toJsonRpcUrlsMap(jsonRpcMap), [jsonRpcMap]);
}

function toJsonRpcMap<T>(getChainConnections: (chainId: SupportedChainId) => T): Record<SupportedChainId, T> {
  return {
    [SupportedChainId.MAINNET]: getChainConnections(SupportedChainId.MAINNET),
    // [SupportedChainId.OPTIMISM]: getChainConnections(SupportedChainId.OPTIMISM),
    [SupportedChainId.BINANCE]: getChainConnections(SupportedChainId.BINANCE),
    // [SupportedChainId.GNOSIS]: getChainConnections(SupportedChainId.GNOSIS),
    [SupportedChainId.POLYGON]: getChainConnections(SupportedChainId.POLYGON),
    [SupportedChainId.FANTOM]: getChainConnections(SupportedChainId.FANTOM),
    [SupportedChainId.ARBITRUM_ONE]: getChainConnections(SupportedChainId.ARBITRUM_ONE),
    [SupportedChainId.AVALANCHE]: getChainConnections(SupportedChainId.AVALANCHE),
  };
}

function getChainConnections(
  connectionMap: JsonRpcConnectionMap | undefined,
  chainId: SupportedChainId
): (string | JsonRpcProvider)[] {
  const value = connectionMap?.[chainId];
  return (Array.isArray(value) ? value : [value])
    .filter((value): value is string | JsonRpcProvider => Boolean(value))
    .concat(...JSON_RPC_ENDPOINTS[chainId]);
}

export function toJsonRpcConnectionMap(
  connectionMap?: JsonRpcConnectionMap
): Record<SupportedChainId, JsonRpcProvider> {
  function getJsonRpcProvider(chainId: SupportedChainId): JsonRpcProvider {
    const [connection] = getChainConnections(connectionMap, chainId);
    return JsonRpcProvider.isProvider(connection) ? connection : new StaticJsonRpcProvider(connection, Number(chainId));
  }
  return toJsonRpcMap(getJsonRpcProvider);
}

export function toJsonRpcUrlMap(connectionMap?: JsonRpcConnectionMap): Record<SupportedChainId, string> {
  function getJsonRpcUrl(chainId: SupportedChainId): string {
    const [connection] = getChainConnections(connectionMap, chainId);
    return JsonRpcProvider.isProvider(connection) ? connection.connection.url : connection;
  }
  return toJsonRpcMap(getJsonRpcUrl);
}

export function toJsonRpcUrlsMap(connectionMap?: JsonRpcConnectionMap): Record<SupportedChainId, string[]> {
  function getJsonRpcUrls(chainId: SupportedChainId): string[] {
    const connections = getChainConnections(connectionMap, chainId);
    return connections.map((connection) =>
      JsonRpcProvider.isProvider(connection) ? connection.connection.url : connection
    );
  }
  return toJsonRpcMap(getJsonRpcUrls);
}
