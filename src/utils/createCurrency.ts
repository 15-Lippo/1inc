import { Currency, Token } from '@uniswap/sdk-core';
import { nativeOnChain } from '@uniswap/smart-order-router';

import { NATIVE_TOKEN_ADDRESS } from '../constants/tokens';

export const createCurrency = async (
  tokenAddress: string,
  decimals: number,
  chainId: number,
  symbol?: string,
  name?: string
): Promise<Currency> => {
  if (tokenAddress.toLowerCase() === NATIVE_TOKEN_ADDRESS) {
    return nativeOnChain(chainId);
  }
  return new Token(chainId, tokenAddress, decimals, symbol, name);
};
