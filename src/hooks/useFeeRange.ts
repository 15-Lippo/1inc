import { BigNumber } from '@ethersproject/bignumber';
import { useMemo } from 'react';

import { formatGweiFixed, parseGwei } from '../utils';

type Props = {
  maxFee: string;
  maxPriorityFee: string;
  baseFee: string;
};

export const useFeeRange = ({ maxFee, maxPriorityFee, baseFee }: Props) => {
  return useMemo(() => {
    if (!maxPriorityFee || !Number(baseFee)) return;

    const minFeeRange = formatGweiFixed(BigNumber.from(baseFee).add(parseGwei(maxPriorityFee)));

    if (!Number(maxFee) || !minFeeRange) return;

    if (parseGwei(minFeeRange).lt(parseGwei(maxFee)))
      return `${parseFloat(minFeeRange).toFixed(2)} - ${parseFloat(maxFee).toFixed(2)} Gwei`;

    if (parseGwei(minFeeRange).gte(parseGwei(maxFee))) return `${parseFloat(maxFee).toFixed(2)} Gwei`;
  }, [maxFee, maxPriorityFee, baseFee]);
};
