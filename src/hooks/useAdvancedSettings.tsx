import { useAppSelector } from '../store/hooks';
import { formatGweiFixed, parseGwei } from '../utils';

export const useAdvancedSettings = () => {
  const { gasPriceInfo } = useAppSelector((state) => state.swap.txFeeCalculation);

  const baseFeeWei = gasPriceInfo.baseFee;
  const baseFeeGwei = formatGweiFixed(baseFeeWei);

  const maxFeeGwei = formatGweiFixed(gasPriceInfo.price);
  const maxFeeWei = parseGwei(maxFeeGwei);

  const estPriorityFeeGwei = Number(baseFeeGwei) ? '5' : '0';
  const estPriorityFeeWei = parseGwei(estPriorityFeeGwei);
  const estMaxFeeGwei = Math.ceil(Number(maxFeeGwei)).toString();

  const rangeDiffWei = maxFeeWei.sub(baseFeeWei);

  const maxPriorityFeeWei = rangeDiffWei.gt(estPriorityFeeWei) ? estPriorityFeeWei : rangeDiffWei;

  const maxPriorityFeeGwei = formatGweiFixed(maxPriorityFeeWei);

  return {
    baseFee: baseFeeGwei,
    baseFeeWei,
    maxFeeGwei,
    estPriorityFee: estPriorityFeeGwei,
    estMaxFee: estMaxFeeGwei,
    maxPriorityFeeGwei,
  };
};
