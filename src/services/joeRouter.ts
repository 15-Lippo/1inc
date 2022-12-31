import { Contract } from '@ethersproject/contracts';

import JoeRouterABI from '../abi/JoeRouterABI';
import { Token } from '../store';
import { getContract } from '../utils';
import { getSwapAvalancheType, SwapAvalancheType } from '../utils/getSwapAvalancheType';
import { UpdateJoeRouterParams } from './types';

export const JoeRouter = (params: UpdateJoeRouterParams): Contract => {
  const JoeRouterAddress = process.env.JOE_ROUTER_ADDRESS || '0x60aE616a2155Ee3d9A68541Ba4544862310933d4';

  const contract: Contract = getContract(JoeRouterAddress, JoeRouterABI, params.provider);

  if (!contract) {
    throw Error('Failed to get JoeRouter contract.');
  }

  return contract;
};

export const getSwapPath = async (
  params: UpdateJoeRouterParams,
  { fromToken, toToken }: { fromToken: Token; toToken: Token }
): Promise<any[]> => {
  const WAVAX = await JoeRouter(params).WAVAX();

  const { fromTokenAddress, toTokenAddress } = {
    fromTokenAddress: fromToken.address,
    toTokenAddress: toToken.address,
  };
  const swapType = getSwapAvalancheType({ fromToken, toToken });

  const swapPaths = {
    [SwapAvalancheType.swapExactTokensForTokens]: [fromTokenAddress, WAVAX, toTokenAddress],
    [SwapAvalancheType.swapExactTokensForAVAX]: [fromTokenAddress, WAVAX],
    [SwapAvalancheType.swapExactAVAXForTokens]: [WAVAX, toTokenAddress],
  };

  return swapPaths[swapType];
};
