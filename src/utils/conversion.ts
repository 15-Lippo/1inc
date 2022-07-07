import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { formatUnits, parseUnits } from '@ethersproject/units';

export const formatGwei = (value: BigNumberish): string => {
  return formatUnits(value, 'gwei');
};

export const formatGweiFixed = (value: BigNumberish): string => {
  return parseFloat(formatUnits(value, 'gwei')).toFixed(2);
};

export const formatUsdFixed = (value: BigNumberish): string => {
  return parseFloat(formatUnits(value, 6)).toFixed(2);
};

export const parseGwei = (value: string): BigNumber => {
  return parseUnits(value, 'gwei');
};
