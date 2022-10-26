import { SupportedChainId } from '../types';

export const JSON_RPC_ENDPOINTS: Record<SupportedChainId, string[]> = {
  [SupportedChainId.MAINNET]: ['https://rpc.ankr.com/eth'],
  [SupportedChainId.OPTIMISM]: ['https://mainnet.optimism.io'],
  [SupportedChainId.BINANCE]: ['https://bsc-dataseed1.ninicoin.io'],
  [SupportedChainId.GNOSIS]: ['https://rpc.gnosischain.com'],
  [SupportedChainId.POLYGON]: ['https://polygon-rpc.com'],
  [SupportedChainId.FANTOM]: ['https://rpc.ftm.tools'],
  [SupportedChainId.ARBITRUM_ONE]: ['https://arb1.arbitrum.io/rpc'],
  [SupportedChainId.AVALANCHE]: ['https://api.avax.network/ext/bc/C/rpc'],
};
