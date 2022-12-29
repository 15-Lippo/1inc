import { MaxUint256 } from '@uniswap/sdk-core';

import ERC20ABI from '../abi/ERC20ABI';
import { JOE_ROUTER_ADDRESS, V3_SWAP_ROUTER_ADDRESS } from '../constants';
import { INCH_NATIVE_TOKEN_ADDRESS } from '../constants/tokens';
import { getContract } from '../utils';
import { fetchOneInchSpender } from './oneInchApi';
import { AllowanceParams, AllowanceParamsWithSpender } from './types';

const getAllowance = async (params: AllowanceParamsWithSpender) => {
  if (params.tokenAddress === INCH_NATIVE_TOKEN_ADDRESS) {
    return MaxUint256.toString();
  }
  const erc20Contract = getContract(params.tokenAddress, ERC20ABI, params.provider);
  return (await erc20Contract.allowance(params.account, params.spender)).toString();
};

export const getUniswapAllowance = async (params: AllowanceParams): Promise<string> => {
  return getAllowance({ ...params, spender: V3_SWAP_ROUTER_ADDRESS });
};

export const getOneInchAllowance = async (params: AllowanceParams): Promise<string> => {
  const spender: string = await fetchOneInchSpender(params.chainId);
  return getAllowance({ ...params, spender });
};

export const getJoeRouterAllowance = async (params: AllowanceParams): Promise<string> => {
  return getAllowance({ ...params, spender: JOE_ROUTER_ADDRESS });
};
