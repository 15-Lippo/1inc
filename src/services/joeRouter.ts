import { Contract } from '@ethersproject/contracts';

import JoeRouterABI from '../abi/JoeRouterABI';
import { getContract } from '../utils';
import { UpdateJoeRouterParams } from './types';

export const JoeRouter = (params: UpdateJoeRouterParams): Contract => {
  const JoeRouterAddress = process.env.JOE_ROUTER_ADDRESS || '0x60aE616a2155Ee3d9A68541Ba4544862310933d4';

  const contract: Contract = getContract(JoeRouterAddress, JoeRouterABI, params.provider);

  if (!contract) {
    throw Error('Failed to get JoeRouter contract.');
  }

  return contract;
};
