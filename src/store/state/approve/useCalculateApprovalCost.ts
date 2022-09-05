import { BigNumber } from '@ethersproject/bignumber';
import { useCallback, useEffect, useState } from 'react';

import { useActiveWeb3React } from '../../../packages';
import { calculateTxFee } from '../../../utils';
import { useAppSelector } from '../../hooks';

export const useCalculateApprovalCost = () => {
  const { account, library } = useActiveWeb3React();
  const [gasLimitFromProvider, setGasLimitFromProvider] = useState<BigNumber>(BigNumber.from('150000'));
  const [approvalTxFee, setApprovalTxFee] = useState<string>('');
  const { gasPriceInfo, slippage, approveTransactionInfo } = useAppSelector((state) => ({
    gasPriceInfo: state.swap.txFeeCalculation?.gasPriceInfo,
    slippage: state.swap.slippage,
    approveTransactionInfo: state.approve.approveTransactionInfo,
  }));

  const estimateGasLimit = useCallback(async () => {
    if (!account || !library || !approveTransactionInfo.data || Number(approveTransactionInfo?.value)) return;
    try {
      /**
       Returns estimated gas limit that would
       be required to submit transaction to the network.
       May not be accurate.

       Approval is only needed for non-native tokens so there
       is no reason to set "value" because "value" is
       always "0" if the token is not native.
       * */
      const gasLimit: BigNumber = await library.estimateGas(approveTransactionInfo);

      setGasLimitFromProvider(gasLimit);
    } catch ({ message }) {
      console.error('Estimate gas unit (limit) failed:', message);
    }
  }, [approveTransactionInfo.data, slippage]);

  useEffect(() => {
    if (!gasLimitFromProvider || !gasPriceInfo?.price) return;
    const calculatedFee = calculateTxFee(String(gasLimitFromProvider), gasPriceInfo?.price);

    if (calculatedFee) setApprovalTxFee(calculatedFee);
  }, [gasLimitFromProvider, gasPriceInfo?.price, approveTransactionInfo.data, slippage]);

  return { estimateGasLimit, approvalTxFee };
};
