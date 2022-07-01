import { Field } from '../store/state/swap/swapSlice';
import { SupportedChainId } from './chains';

export const TOKEN_HELPER_ADDRESS = {
  [SupportedChainId.LOCALHOST]: '0x31A40a1a176f66fd63ca8075eAE682D2Dc438B2B',
  [SupportedChainId.MAINNET]: '',
  [SupportedChainId.ARBITRUM_ONE]: '',
  [SupportedChainId.OPTIMISM]: '',
  [SupportedChainId.POLYGON]: '',
  [SupportedChainId.BINANCE]: '',
  [SupportedChainId.AVALANCHE]: '',
  [SupportedChainId.FANTOM]: '',
  [SupportedChainId.GNOSIS]: '',
};

export const NATIVE_TOKEN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export const REFRESH_QUOTE_DELAY = 15;

export const DEFAULT_TOKENS = {
  [Field.INPUT]: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  [Field.OUTPUT]: '0x111111111117dc0aa78b770fa6a738034120c302',
};
export const MAIN_TOKENS = [
  'ETHEREUM',
  'USD COIN',
  'DAI STABLECOIN',
  'TETHER USD',
  'WRAPPED BTC',
  'AAVE TOKEN',
  'WRAPPED ETHER',
  'BINANCE USD',
  'CHAIN LINK',
  '1INCH TOKEN',
  'UNISWAP',
  'GRAPH TOKEN',
  'SUSHI TOKEN',
];

export const EXPLORER_LINKS = {
  [SupportedChainId.LOCALHOST]: { name: 'EtherScan', link: 'https://etherscan.io' },
  [SupportedChainId.MAINNET]: { name: 'EtherScan', link: 'https://etherscan.io' },
  [SupportedChainId.ARBITRUM_ONE]: { name: 'ArbiScan', link: 'https://arbiscan.io' },
  [SupportedChainId.OPTIMISM]: { name: 'Optimism', link: 'https://optimistic.etherscan.io' },
  [SupportedChainId.POLYGON]: { name: 'PolygonScan', link: 'https://polygonscan.com' },
  [SupportedChainId.BINANCE]: { name: 'BscScan', link: 'https://bscscan.com' },
  [SupportedChainId.AVALANCHE]: { name: 'Snowtrace', link: 'https://snowtrace.io' },
  [SupportedChainId.FANTOM]: { name: 'FTMScan', link: 'https://ftmscan.com' },
  [SupportedChainId.GNOSIS]: { name: 'BlockScout', link: 'https://blockscout.com/xdai/mainnet' },
};

export const FAVORITE_TOKENS = {
  [SupportedChainId.LOCALHOST]: [
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    '0x6b175474e89094c44da98b954eedeac495271d0f',
    '0xdac17f958d2ee523a2206206994597c13d831ec7',
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    '0x111111111117dc0aa78b770fa6a738034120c302',
  ],
  [SupportedChainId.MAINNET]: [
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    '0x6b175474e89094c44da98b954eedeac495271d0f',
    '0xdac17f958d2ee523a2206206994597c13d831ec7',
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    '0x111111111117dc0aa78b770fa6a738034120c302',
  ],
  [SupportedChainId.OPTIMISM]: [
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    '0x8700daec35af8ff88c16bdf0418774cb3d7599b4',
    '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
    '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
    '0x68f180fcce6836688e9084f035309e29bf0a2095',
    '0x350a791bfc2c21f9ed5d10980dad2e2638ffa7f6',
  ],
  [SupportedChainId.BINANCE]: [
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
    '0x55d398326f99059ff775485246999027b3197955',
    '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
    '0x111111111117dc0aa78b770fa6a738034120c302',
  ],
  [SupportedChainId.GNOSIS]: [
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d',
    '0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1',
    '0x4ecaba5870353805a9f068101a40e0f32ed605c6',
    '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
    '0x7f7440c5098462f833e123b44b8a03e1d9785bab',
  ],
  [SupportedChainId.POLYGON]: [
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    '0x71b821aa52a49f32eed535fca6eb5aa130085978',
    '0xd6df932a45c0f255f85145f286ea0b292b21c90b',
    '0x033d942a6b495c4071083f4cde1f17e986fe856c',
    '0x6ab6d61428fde76768d7b45d8bfeec19c6ef91a8',
  ],
  [SupportedChainId.FANTOM]: [
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
    '0x321162cd933e2be498cd2267a90534a804051b11',
    '0x049d68029688eabf473097a2fc38ef61633a3c7a',
    '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
  ],
  [SupportedChainId.ARBITRUM_ONE]: [
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    '0x0e15258734300290a651fdbae8deb039a8e7a2fa',
    '0x040d1edc9569d4bab2d15287dc5a4f10f56a56b8',
    '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
    '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
  ],
  [SupportedChainId.AVALANCHE]: [
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
    '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab',
    '0x50b7545627a5162f82a992c33b87adc75187b218',
    '0xc7198437980c041c805a1edcba50c1ce5db95118',
    '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
  ],
};
