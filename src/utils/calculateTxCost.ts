import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';

export const calculateTxCost = (txFee: string, typedValue: string) => {
  return formatUnits(BigNumber.from(txFee).add(BigNumber.from(typedValue)), 'wei');
};

export const calculateTxFee = (gasLimit: string, maxFeePerGas: string) => {
  return formatUnits(BigNumber.from(gasLimit).mul(BigNumber.from(maxFeePerGas)), 'wei');
};

export const calculateRoughFees = (
  gasLimits: { [protocolName: string]: { estimatedGas: string } },
  gasPrice: string
) => {
  const txFees: { [protocolName: string]: string } = {};
  Object.entries(gasLimits).forEach(([protocolName, data]) => {
    txFees[protocolName] = calculateTxFee(data.estimatedGas, gasPrice);
  });
  return txFees;
};
