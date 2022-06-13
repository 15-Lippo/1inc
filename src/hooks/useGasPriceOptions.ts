import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';

export enum SupportedGasOptions {
  Instant = 'instant',
  High = 'high',
  Medium = 'medium',
  Low = 'low',
}

const parseToGwei = (value: BigNumber) => {
  return parseFloat(formatUnits(value, 'gwei')).toFixed(2);
};

export const useGasPriceOptions = () => {
  const { library } = useWeb3React();
  const [blockNum, setBlockNum] = useState<number>();
  const [gasOptions, setOptions] = useState({
    [SupportedGasOptions.Instant]: {
      label: 'Instant',
      range: '-- / -- - 0.00 Gwei',
      timeLabel: '< 10 sec',
      price: '0',
    },
    [SupportedGasOptions.High]: {
      label: 'High',
      range: '-- / -- - 0.00 Gwei',
      timeLabel: '~ 12 sec',
      price: '0',
    },
    [SupportedGasOptions.Medium]: {
      label: 'Medium',
      range: '-- / -- - 0.00 Gwei',
      timeLabel: '~ 30 sec',
      price: '0',
    },
    [SupportedGasOptions.Low]: {
      label: 'Low',
      range: '-- / -- - 0.00 Gwei',
      timeLabel: '≥ 1 min',
      price: '0',
    },
  });

  if (library)
    library.on('block', async (block: number) => {
      return setBlockNum(block);
    });

  const getGasOptions = async () => {
    if (library) {
      const feeData = await library.getFeeData();
      const gasPriceGwei = parseToGwei(feeData.gasPrice);

      const percents = {
        oneHundred: BigNumber.from('100'),
        low: BigNumber.from('3'),
        medium: BigNumber.from('10'),
        high: BigNumber.from('15'),
        instant: BigNumber.from('50'),
      };

      const instant = feeData.gasPrice.mul(percents.instant).div(percents.oneHundred);
      const instantOption = instant.add(feeData.gasPrice);

      const high = feeData.gasPrice.mul(percents.high).div(percents.oneHundred);
      const highOption = high.add(feeData.gasPrice);

      const medium = feeData.gasPrice.mul(percents.medium).div(percents.oneHundred);
      const mediumOption = medium.add(feeData.gasPrice);

      const low = feeData.gasPrice.mul(percents.low).div(percents.oneHundred);
      const lowOption = low.add(feeData.gasPrice);

      const gasOptions = {
        [SupportedGasOptions.Instant]: {
          label: 'Instant',
          range: `${gasPriceGwei} - ${parseToGwei(instantOption)} Gwei`,
          timeLabel: '< 10 sec',
          price: formatUnits(instantOption, 'wei'),
        },
        [SupportedGasOptions.High]: {
          label: 'High',
          range: `${gasPriceGwei} - ${parseToGwei(highOption)} Gwei`,
          timeLabel: '~ 12 sec',
          price: formatUnits(highOption, 'wei'),
        },
        [SupportedGasOptions.Medium]: {
          label: 'Medium',
          range: `${gasPriceGwei} - ${parseToGwei(mediumOption)} Gwei`,
          timeLabel: '~ 30 sec',
          price: formatUnits(mediumOption, 'wei'),
        },
        [SupportedGasOptions.Low]: {
          label: 'Low',
          range: `${gasPriceGwei} - ${parseToGwei(lowOption)} Gwei`,
          timeLabel: '≥ 1 min',
          price: formatUnits(lowOption, 'wei'),
        },
      };
      setOptions(gasOptions);
    }
    return gasOptions;
  };

  useEffect(() => {
    getGasOptions();
  }, [blockNum]);
  return { gasOptions, blockNum };
};
