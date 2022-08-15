import { BigNumber } from '@ethersproject/bignumber';
import { TransactionRequest } from '@ethersproject/providers';
import { useCallback, useEffect, useState } from 'react';

import { networkConfigs } from '../../../constants';
import { useActiveWeb3React } from '../../../packages/web3-provider';
import { calculateGasMargin, calculateTxFee } from '../../../utils';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setGasLimit, setTxFee } from './swapSlice';

export const useCalculateTxCost = () => {
  const dispatch = useAppDispatch();
  const { account, library, chainId } = useActiveWeb3React();
  const swapInfo = useAppSelector((state) => state.swap.swapInfo);
  const gasPriceInfo = useAppSelector((state) => state.swap.txFeeCalculation?.gasPriceInfo);
  const slippage = useAppSelector((state) => state.swap.slippage);
  const [gasLimitFromProvider, setGasLimitFromProvider] = useState<string>('160000');

  useEffect(() => {
    if (!chainId) return;
    setGasLimitFromProvider(networkConfigs[chainId].minGasLimit);
  }, [chainId]);

  useEffect(() => {
    dispatch(setGasLimit(gasLimitFromProvider));
  }, [gasLimitFromProvider]);

  const estimateGasLimit = useCallback(async () => {
    if (!account || !swapInfo?.tx?.data || !library) return;

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

    try {
      const gasLimit = await library.estimateGas(tx);

      // gasLimit should be between 100000 and 11500000
      let gasMargin;
      if (gasLimit) {
        gasMargin = calculateGasMargin(gasLimit);
      } else {
        gasMargin = calculateGasMargin(BigNumber.from(gasLimitFromProvider));
      }
      setGasLimitFromProvider(String(gasMargin));
    } catch ({ message }) {
      console.error('Estimate gas unit (limit) failed. Try to increase slippage percent:', message);
    }
  }, [swapInfo?.tx?.data, swapInfo?.tx?.to, swapInfo?.tx?.value, slippage]);

  useEffect(() => {
    if (!gasLimitFromProvider || !gasPriceInfo?.price) return;
    const calculatedFee = calculateTxFee(gasLimitFromProvider, gasPriceInfo?.price);

    if (calculatedFee) dispatch(setTxFee(calculatedFee));
  }, [gasLimitFromProvider, gasPriceInfo?.price, swapInfo?.tx?.data, slippage]);

  return { estimateGasLimit };
};
