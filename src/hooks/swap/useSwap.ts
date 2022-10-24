import { useCallback, useEffect, useState } from 'react';

import { estimateGas } from '../../services';
import {
  ApproveStatus,
  getTokenInfo,
  setIsWaitingTx,
  setLastTxHash,
  setTxErrorMessage,
  updateAllTokenBalances,
  useAppDispatch,
} from '../../store';
import { useApproveStatus } from '../approve/useApproveStatus';
import { SwapInfo } from '../update/types';
import { useUpdateParams } from '../update/useUpdateParams';
import { useBuildSwapTx } from './useBuildSwapTx';

export const useSwap = () => {
  const txBuilder = useBuildSwapTx();
  const dispatch = useAppDispatch();
  const params = useUpdateParams();
  const approveStatus = useApproveStatus();

  const [swapInfo, setSwapInfo] = useState<SwapInfo | undefined>();

  const updateTx = useCallback(async () => {
    if (!params) {
      setSwapInfo(undefined);
      return;
    }
    const swapInfo = await txBuilder(params);
    const tx = swapInfo.tx;
    if (!tx.gasLimit) {
      tx.gasLimit = await estimateGas(tx, params.library, params.chainId);
    }
    setSwapInfo(swapInfo);
  }, [txBuilder, params]);

  useEffect(() => {
    console.log('Updated swap tx info:', swapInfo);
  }, [swapInfo]);

  const executeSwap = useCallback(async () => {
    if (!params || approveStatus !== ApproveStatus.NO_APPROVAL_NEEDED || !swapInfo) return;

    const txReq = swapInfo.tx;

    try {
      dispatch(setTxErrorMessage(''));
      dispatch(setIsWaitingTx(true));
      const signer = params.library.getSigner(params.fromAddress);
      const tx = await signer.sendTransaction(txReq);

      await tx.wait();
      if (tx.hash) {
        const updatedBalance = await getTokenInfo(
          params.library,
          params.chainId,
          [params.fromTokenAddress, params.toTokenAddress, '0x0000000000000000000000000000000000000000'],
          '0x0000000000000000000000000000000000000000',
          params.fromAddress
        );
        dispatch(setLastTxHash(tx.hash));
        dispatch(updateAllTokenBalances(updatedBalance));
      }
    } catch ({ message }) {
      dispatch(setTxErrorMessage(message));
      console.error('Attempt to send transaction failed:', message);
      return { error: message };
    }
  }, [swapInfo, params, approveStatus]);

  return {
    toTokenAmount: swapInfo?.toTokenAmount || '',
    executeSwap,
    updateTx,
  };
};
