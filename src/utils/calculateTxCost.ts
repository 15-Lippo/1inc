import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';

export const calculateTxCost = (txFee: string, typedValue: string) => {
  return formatUnits(BigNumber.from(txFee).add(BigNumber.from(typedValue)), 'wei');
};

export const calculateTxFee = (gasLimit: string, maxFeePerGas: string) => {
  return formatUnits(BigNumber.from(gasLimit).mul(BigNumber.from(maxFeePerGas)), 'wei');
};
