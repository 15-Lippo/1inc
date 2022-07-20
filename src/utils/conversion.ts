import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { formatUnits, parseUnits } from '@ethersproject/units';

const formatGweiFixed = (value: BigNumberish): string => {
  return parseFloat(formatUnits(value, 'gwei')).toFixed(2);
};

const formatUsdFixed = (value: BigNumberish): string => {
  return parseFloat(formatUnits(value, 6)).toFixed(2);
};

const parseGwei = (value: string): BigNumber => {
  return parseUnits(value, 'gwei');
};

export { formatGweiFixed, formatUsdFixed, parseGwei };
