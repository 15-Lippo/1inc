import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { useEffect, useState } from 'react';

import { useActiveWeb3React } from '../packages/web3-provider';
import { formatGweiFixed, parseGwei } from '../utils';

export enum SupportedGasOptions {
  Instant,
  High,
  Medium,
  Low,
}

export type GasOption = {
  id: SupportedGasOptions;
  label: string;
  range: string;
  timeLabel: string;
  price: string;
  baseFee: string;
};

export const useGasPriceOptions = () => {
  const { library } = useActiveWeb3React();
  const [blockNum, setBlockNum] = useState<number>();

  const zeroGwei = '-- / -- - 0.00 Gwei';

  const [gasOptions, setOptions] = useState<{ [option in SupportedGasOptions]?: GasOption }>({
    [SupportedGasOptions.Instant]: {
      id: SupportedGasOptions.Instant,
      label: `Instant`,
      range: zeroGwei,
      timeLabel: '< 10 sec',
      price: '0',
      baseFee: '0',
    },
    [SupportedGasOptions.High]: {
      id: SupportedGasOptions.High,
      label: 'High',
      range: zeroGwei,
      timeLabel: '~ 12 sec',
      price: '0',
      baseFee: '0',
    },
    [SupportedGasOptions.Medium]: {
      id: SupportedGasOptions.Medium,
      label: 'Medium',
      range: zeroGwei,
      timeLabel: '~ 30 sec',
      price: '0',
      baseFee: '0',
    },
    [SupportedGasOptions.Low]: {
      id: SupportedGasOptions.Low,
      label: 'Low',
      range: zeroGwei,
      timeLabel: '≥ 1 min',
      price: '0',
      baseFee: '0',
    },
  });

  if (library)
    library.on('block', async (block: number) => {
      return setBlockNum(block);
    });

  const getGasOptions = async () => {
    if (library) {
      const feeData = await library.getFeeData();
      if (feeData && feeData.gasPrice) {
        const gasPriceGwei = formatGweiFixed(feeData.gasPrice);

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

        const baseFee = parseGwei(gasPriceGwei).toString();

        const options = {
          [SupportedGasOptions.Instant]: {
            ...gasOptions[SupportedGasOptions.Instant],
            range: `${gasPriceGwei} - ${formatGweiFixed(instantOption)} Gwei`,
            price: formatUnits(instantOption, 'wei'),
            baseFee,
          },
          [SupportedGasOptions.High]: {
            ...gasOptions[SupportedGasOptions.High],
            range: `${gasPriceGwei} - ${formatGweiFixed(highOption)} Gwei`,
            price: formatUnits(highOption, 'wei'),
            baseFee,
          },
          [SupportedGasOptions.Medium]: {
            ...gasOptions[SupportedGasOptions.Medium],
            range: `${gasPriceGwei} - ${formatGweiFixed(mediumOption)} Gwei`,
            price: formatUnits(mediumOption, 'wei'),
            baseFee,
          },
          [SupportedGasOptions.Low]: {
            ...gasOptions[SupportedGasOptions.Low],
            range: `${gasPriceGwei} - ${formatGweiFixed(lowOption)} Gwei`,
            price: formatUnits(lowOption, 'wei'),
            baseFee,
          },
        };
        // @ts-ignore
        setOptions(options);
      }
    }
    return gasOptions;
  };

  useEffect(() => {
    getGasOptions();
  }, [blockNum]);
  return { gasOptions, blockNum };
};
