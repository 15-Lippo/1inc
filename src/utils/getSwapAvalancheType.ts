import { Token } from '../store/state/tokens/tokensSlice';

export enum SwapAvalancheType {
  swapExactAVAXForTokens = 'swapExactAVAXForTokens',
  swapExactTokensForAVAX = 'swapExactTokensForAVAX',
  swapExactTokensForTokens = 'swapExactTokensForTokens',
}

export interface InputOutputTokens {
  fromToken: Token;
  toToken: Token;
}

export const getSwapAvalancheType = (tokens: InputOutputTokens): SwapAvalancheType => {
  if (tokens.fromToken.name === 'Avalanche') {
    return SwapAvalancheType.swapExactAVAXForTokens;
  }

  return tokens.toToken.name === 'Avalanche'
    ? SwapAvalancheType.swapExactTokensForAVAX
    : SwapAvalancheType.swapExactTokensForTokens;
};
