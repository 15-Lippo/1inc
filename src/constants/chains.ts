export enum SupportedChainId {
  MAINNET = 1,
  ARBITRUM_ONE = 42161,
  OPTIMISM = 10,
  POLYGON = 137,
  BINANCE = 56,
  AVALANCHE = 43114,
  FANTOM = 250,
  GNOSIS = 100,
  LOCALHOST = 1337,
}

/**
 * Array of all the supported chain IDs
 */
export const ALL_SUPPORTED_CHAIN_IDS = new Set(Object.values(SupportedChainId).filter((id) => typeof id === 'number'));
