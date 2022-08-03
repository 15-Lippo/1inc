import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useActiveWeb3React } from '../packages/web3-provider';
import { formatGweiFixed, parseGwei } from '../utils';

export enum SupportedGasOptions {
  Instant,
  High,
  Medium,
  Low,
}

export const useGasPriceOptions = () => {
  const { t } = useTranslation();
  const { library } = useActiveWeb3React();
  const [blockNum, setBlockNum] = useState<number>();
  const [gasOptions, setOptions] = useState({
    [SupportedGasOptions.Instant]: {
      id: SupportedGasOptions.Instant,
      label: t(`Instant`),
      range: '-- / -- - 0.00 Gwei',
      timeLabel: '< 10' + t(`sec`),
      price: '0',
      baseFee: '0',
    },
    [SupportedGasOptions.High]: {
      id: SupportedGasOptions.High,
      label: t(`High`),
      range: '-- / -- - 0.00 Gwei',
      timeLabel: '~ 12' + t(`sec`),
      price: '0',
      baseFee: '0',
    },
    [SupportedGasOptions.Medium]: {
      id: SupportedGasOptions.Medium,
      label: t(`Medium`),
      range: '-- / -- - 0.00 Gwei',
      timeLabel: '~ 30' + t(`sec`),
      price: '0',
      baseFee: '0',
    },
    [SupportedGasOptions.Low]: {
      id: SupportedGasOptions.Low,
      label: t(`Low`),
      range: '-- / -- - 0.00 Gwei',
      timeLabel: '≥ 1' + t(`min`),
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

        const gasOptions = {
          [SupportedGasOptions.Instant]: {
            id: SupportedGasOptions.Instant,
            label: t(`Instant`),
            range: `${gasPriceGwei} - ${formatGweiFixed(instantOption)} Gwei`,
            timeLabel: '< 10' + t(`sec`),
            price: formatUnits(instantOption, 'wei'),
            baseFee: parseGwei(gasPriceGwei).toString(),
          },
          [SupportedGasOptions.High]: {
            id: SupportedGasOptions.High,
            label: t(`High`),
            range: `${gasPriceGwei} - ${formatGweiFixed(highOption)} Gwei`,
            timeLabel: '~ 12' + t(`sec`),
            price: formatUnits(highOption, 'wei'),
            baseFee: parseGwei(gasPriceGwei).toString(),
          },
          [SupportedGasOptions.Medium]: {
            id: SupportedGasOptions.Medium,
            label: t(`Medium`),
            range: `${gasPriceGwei} - ${formatGweiFixed(mediumOption)} Gwei`,
            timeLabel: '~ 30' + t(`sec`),
            price: formatUnits(mediumOption, 'wei'),
            baseFee: parseGwei(gasPriceGwei).toString(),
          },
          [SupportedGasOptions.Low]: {
            id: SupportedGasOptions.Low,
            label: t(`Low`),
            range: `${gasPriceGwei} - ${formatGweiFixed(lowOption)} Gwei`,
            timeLabel: '≥ 1' + t(`min`),
            price: formatUnits(lowOption, 'wei'),
            baseFee: parseGwei(gasPriceGwei).toString(),
          },
        };
        setOptions(gasOptions);
      }
    }
    return gasOptions;
  };

  useEffect(() => {
    getGasOptions();
  }, [blockNum]);
  return { gasOptions, blockNum };
};
