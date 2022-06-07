import { TransactionRequest } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';

import { calculateGasMargin, calculateTxFee } from '../../../utils';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setGasLimit, setMaxFeePerGas, setTxFee } from './swapSlice';

export const useCalculateTxCost = () => {
  const dispatch = useAppDispatch();
  const { account, library } = useWeb3React();
  const swapInfo = useAppSelector((state) => state.swap.swapInfo);
  const [gasLimitFromProvider, setGasLimitFromProvider] = useState<string>('');
  const [maxFeePerGasWei, setMaxFeePerGasWei] = useState<string>('');

  useEffect(() => {
    dispatch(setGasLimit(gasLimitFromProvider));
  }, [gasLimitFromProvider]);

  useEffect(() => {
    dispatch(setMaxFeePerGas(maxFeePerGasWei));
  }, [maxFeePerGasWei]);

  const tx: TransactionRequest = !Number(swapInfo?.tx?.value)
    ? {
        to: swapInfo?.tx?.to,
        data: swapInfo?.tx?.data,
      }
    : {
        to: swapInfo?.tx?.to,
        data: swapInfo?.tx?.data,
        value: swapInfo?.tx?.value,
      };

  const estimateGasLimit = useCallback(async () => {
    if (!account || !swapInfo?.tx?.data) return;

    try {
      const gasLimit = await library.estimateGas(tx);
      const gasMargin = calculateGasMargin(gasLimit);
      setGasLimitFromProvider(String(gasMargin));
    } catch ({ message }) {
      console.error('Estimate gas unit (limit) failed:', message);
    }
  }, [swapInfo?.tx?.data, swapInfo?.tx?.to, swapInfo?.tx?.value]);

  const getFeeData = async () => {
    if (!account) return;
    try {
      const feeData = await library.getFeeData();
      const maxFeePerGas = formatUnits(feeData.maxFeePerGas, 'wei');
      setMaxFeePerGasWei(maxFeePerGas);
    } catch ({ message }) {
      console.error('Get fee data failed:', message);
    }
  };

  useEffect(() => {
    if (!gasLimitFromProvider || !maxFeePerGasWei) return;
    dispatch(setTxFee(calculateTxFee(gasLimitFromProvider, maxFeePerGasWei)));
  }, [gasLimitFromProvider, maxFeePerGasWei, swapInfo?.tx?.data]);

  return { estimateGasLimit, getFeeData };
};
