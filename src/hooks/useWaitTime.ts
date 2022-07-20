import _ from 'lodash';
import { useMemo } from 'react';

import { formatGweiFixed, parseGwei } from '../utils';

type Props = {
  maxFee: string;
  gasOptions: any;
  baseFee: string;
};

export const useWaitTime = ({ maxFee, gasOptions, baseFee }: Props): string => {
  const [instant, high, medium, low] =
    gasOptions && !_.isEmpty(gasOptions)
      ? Object.values(gasOptions).flatMap((option: any) => ({
          maxFee: parseGwei(formatGweiFixed(option.price)),
          timeLabel: option.timeLabel,
        }))
      : [undefined];

  return useMemo(() => {
    if (
      !Number(maxFee) ||
      !Number(baseFee) ||
      !instant ||
      !high ||
      !medium ||
      !low ||
      !Number(instant.maxFee) ||
      !Number(high.maxFee) ||
      !Number(medium.maxFee) ||
      !Number(low.maxFee)
    )
      return;

    const maxFeeWei = parseGwei(maxFee);
    const baseFeeWei = parseGwei(baseFee);

    if (maxFeeWei.gt(baseFeeWei) && maxFeeWei.lt(low.maxFee)) return low.timeLabel;
    if (maxFeeWei.gte(low.maxFee) && maxFeeWei.lt(medium.maxFee)) return low.timeLabel;
    if (maxFeeWei.gte(medium.maxFee) && maxFeeWei.lt(high.maxFee)) return medium.timeLabel;
    if (maxFeeWei.gte(high.maxFee) && maxFeeWei.lt(instant.maxFee)) return high.timeLabel;
    if (maxFeeWei.gte(instant.maxFee)) return instant.timeLabel;
  }, [maxFee, baseFee]);
};
