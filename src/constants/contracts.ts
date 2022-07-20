import { SupportedChainId } from './chains';

export const TOKEN_HELPER_ADDRESS = {
  [SupportedChainId.LOCALHOST]: process.env.REACT_APP_HELPER_CONTRACT || '',
  [SupportedChainId.MAINNET]: '0x31A40a1a176f66fd63ca8075eAE682D2Dc438B2B',
  [SupportedChainId.ARBITRUM_ONE]: '',
  [SupportedChainId.OPTIMISM]: '',
  [SupportedChainId.POLYGON]: '',
  [SupportedChainId.BINANCE]: '',
  [SupportedChainId.AVALANCHE]: '',
  [SupportedChainId.FANTOM]: '',
  [SupportedChainId.GNOSIS]: '',
};
