import { BigNumber } from '@ethersproject/bignumber';

export const calculateGasMargin = (value: BigNumber) => {
  return value.mul(115).div(100);
};
