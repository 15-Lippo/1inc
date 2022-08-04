import { Field } from '../types';
import { SupportedChainId } from './chains';

export const NATIVE_TOKEN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export const DEFAULT_TOKENS = {
  [Field.INPUT]: NATIVE_TOKEN_ADDRESS,
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

export const FAVORITE_TOKENS = {
  [SupportedChainId.LOCALHOST]: [
    NATIVE_TOKEN_ADDRESS,
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    '0x6b175474e89094c44da98b954eedeac495271d0f',
    '0xdac17f958d2ee523a2206206994597c13d831ec7',
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    '0x111111111117dc0aa78b770fa6a738034120c302',
  ],
  [SupportedChainId.MAINNET]: [
    NATIVE_TOKEN_ADDRESS,
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    '0x6b175474e89094c44da98b954eedeac495271d0f',
    '0xdac17f958d2ee523a2206206994597c13d831ec7',
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    '0x111111111117dc0aa78b770fa6a738034120c302',
  ],
  [SupportedChainId.OPTIMISM]: [
    NATIVE_TOKEN_ADDRESS,
    '0x8700daec35af8ff88c16bdf0418774cb3d7599b4',
    '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
    '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
    '0x68f180fcce6836688e9084f035309e29bf0a2095',
    '0x350a791bfc2c21f9ed5d10980dad2e2638ffa7f6',
  ],
  [SupportedChainId.BINANCE]: [
    NATIVE_TOKEN_ADDRESS,
    '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
    '0x55d398326f99059ff775485246999027b3197955',
    '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
    '0x111111111117dc0aa78b770fa6a738034120c302',
  ],
  [SupportedChainId.GNOSIS]: [
    NATIVE_TOKEN_ADDRESS,
    '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d',
    '0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1',
    '0x4ecaba5870353805a9f068101a40e0f32ed605c6',
    '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
    '0x7f7440c5098462f833e123b44b8a03e1d9785bab',
  ],
  [SupportedChainId.POLYGON]: [
    NATIVE_TOKEN_ADDRESS,
    '0x71b821aa52a49f32eed535fca6eb5aa130085978',
    '0xd6df932a45c0f255f85145f286ea0b292b21c90b',
    '0x033d942a6b495c4071083f4cde1f17e986fe856c',
    '0x6ab6d61428fde76768d7b45d8bfeec19c6ef91a8',
  ],
  [SupportedChainId.FANTOM]: [
    NATIVE_TOKEN_ADDRESS,
    '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
    '0x321162cd933e2be498cd2267a90534a804051b11',
    '0x049d68029688eabf473097a2fc38ef61633a3c7a',
    '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
  ],
  [SupportedChainId.ARBITRUM_ONE]: [
    NATIVE_TOKEN_ADDRESS,
    '0x0e15258734300290a651fdbae8deb039a8e7a2fa',
    '0x040d1edc9569d4bab2d15287dc5a4f10f56a56b8',
    '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
    '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
  ],
  [SupportedChainId.AVALANCHE]: [
    NATIVE_TOKEN_ADDRESS,
    '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
    '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab',
    '0x50b7545627a5162f82a992c33b87adc75187b218',
    '0xc7198437980c041c805a1edcba50c1ce5db95118',
    '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
  ],
};

// TODO add more addresses
export const DOLLAR_TIED_TOKENS = {
  [SupportedChainId.LOCALHOST]: [
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // usdc
    '0xdac17f958d2ee523a2206206994597c13d831ec7', // usdt
    '0x6b175474e89094c44da98b954eedeac495271d0f', // dai
  ],
  [SupportedChainId.MAINNET]: [
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // usdc
    '0xdac17f958d2ee523a2206206994597c13d831ec7', // usdt
    '0x6b175474e89094c44da98b954eedeac495271d0f', // dai
  ],
  [SupportedChainId.OPTIMISM]: [
    '0x7f5c764cbc14f9669b88837ca1490cca17c31607', // USDC
  ],
  [SupportedChainId.BINANCE]: [
    '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // USDC
  ],
  [SupportedChainId.GNOSIS]: ['0xddafbb505ad214d7b80b1f830fccc89b60fb7a83'], // USD//C
  [SupportedChainId.POLYGON]: [
    '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC
  ],
  [SupportedChainId.FANTOM]: [
    '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC
  ],
  [SupportedChainId.ARBITRUM_ONE]: [
    '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', // USDC
  ],
  [SupportedChainId.AVALANCHE]: [
    '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e', // USDC
  ],
};
