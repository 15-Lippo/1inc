import {
  arbitrumApi,
  avalancheApi,
  binanceApi,
  ethereumApi,
  fantomApi,
  gnosisApi,
  optimismApi,
  polygonApi,
} from '@yozh-io/1inch-widget-api-client';

import { SupportedChainId } from './chains';

export const APIS = {
  [SupportedChainId.LOCALHOST]: ethereumApi,
  [SupportedChainId.MAINNET]: ethereumApi,
  [SupportedChainId.ARBITRUM_ONE]: arbitrumApi,
  [SupportedChainId.OPTIMISM]: optimismApi,
  [SupportedChainId.POLYGON]: polygonApi,
  [SupportedChainId.BINANCE]: binanceApi,
  [SupportedChainId.AVALANCHE]: avalancheApi,
  [SupportedChainId.FANTOM]: fantomApi,
  [SupportedChainId.GNOSIS]: gnosisApi,
};
