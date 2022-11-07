import { useCallback, useEffect, useState } from 'react';

import { ZERO_ADDRESS } from '../../constants/tokens';
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
import { getTxStatus, TxStatusType } from '../../utils';
import { ITxStatus } from '../../utils/txStatus';
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
      tx.gasLimit = await estimateGas(tx, params.provider, params.chainId);
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
      const signer = params.provider.getSigner(params.fromAddress);
      const tx = await signer.sendTransaction(txReq);

      await tx.wait();

      if (tx.hash) {
        await getTxStatus(tx.hash, params.provider, (txStatus: ITxStatus) => {
          const typeToStatus = {
            [TxStatusType.SUCCESSFUL]: async () => {
              const updatedBalance = await getTokenInfo(
                params.provider,
                params.chainId,
                [params.fromTokenAddress, params.toTokenAddress, ZERO_ADDRESS],
                ZERO_ADDRESS,
                params.fromAddress
              );
              dispatch(setLastTxHash(tx.hash));
              dispatch(setIsWaitingTx(false));
              dispatch(updateAllTokenBalances(updatedBalance));
            },
            [TxStatusType.REVERTED]: async () => {
              dispatch(setTxErrorMessage(txStatus.error));
              dispatch(setIsWaitingTx(false));
            },
            [TxStatusType.PENDING]: async () => {
              console.log('PENDING');
            },
          };
          typeToStatus[txStatus.status]();
        });
      }
    } catch (error) {
      dispatch(setTxErrorMessage(error.message));
      console.error('Attempt to send transaction failed:', error);
      return { error };
    }
  }, [swapInfo, params, approveStatus]);

  return {
    toTokenAmount: swapInfo?.toTokenAmount || '',
    tx: swapInfo?.tx,
    executeSwap,
    updateTx,
  };
};
