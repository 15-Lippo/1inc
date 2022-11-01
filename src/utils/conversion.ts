import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { formatUnits, parseUnits } from '@ethersproject/units';

import { bigFloatToFixed } from './bigFloatToFixed';

const formatGweiFixed = (value: BigNumberish): string => {
  return parseFloat(formatUnits(value, 'gwei')).toFixed(2);
};

const formatUsdFixed = (value: BigNumberish, usdCoinDecimals: number): string => {
  return bigFloatToFixed(formatUnits(value, usdCoinDecimals), 4);
};

const parseGwei = (value: string): BigNumber => {
  return parseUnits(value, 'gwei');
};

export { formatGweiFixed, formatUsdFixed, parseGwei };
