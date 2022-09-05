import { BigNumber } from '@ethersproject/bignumber';
import { useCallback, useEffect, useMemo } from 'react';

import { useActiveWeb3React } from '../../../packages';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getTokenInfo, updateTokenInfo } from '../tokens';
import { setIsWaitingTx, setLastTxHash, setTxErrorMessage } from '../transactions';
import { ApproveStatus, fetchApproveSpender, fetchApproveTransaction, updateApproveStatus } from './approveSlice';

export function useApproval() {
  const dispatch = useAppDispatch();
  const { library, account, chainId } = useActiveWeb3React();
  const gasPriceInfo = useAppSelector((state) => state.swap.txFeeCalculation?.gasPriceInfo);
  const { INPUT, typedValue, approveTransactionInfo, approveAllowanceInfo, spender } = useAppSelector((state) => ({
    typedValue: state.swap.typedValue,
    INPUT: state.tokens.tokens[state.swap.INPUT],
    approveTransactionInfo: state.approve.approveTransactionInfo,
    approveAllowanceInfo: state.approve.approveAllowanceInfo,
    spender: state.approve.spender,
  }));

  useEffect(() => {
    if (spender.address) return;
    dispatch(fetchApproveSpender(chainId));
  }, [spender.address]);

  const approveStatus = useMemo(() => {
    if (!INPUT || !INPUT.address || !account || !typedValue) return ApproveStatus.UNKNOWN;

    // IF IS NATIVE
    if (INPUT.address.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
      return ApproveStatus.NO_APPROVAL_NEEDED;

    // if no data to approve:
    if (!INPUT.userAllowance) return ApproveStatus.UNKNOWN;
    return BigNumber.from(INPUT.userAllowance).lt(BigNumber.from(typedValue))
      ? ApproveStatus.APPROVAL_NEEDED
      : ApproveStatus.NO_APPROVAL_NEEDED;
  }, [INPUT, account, typedValue]);

  useEffect(() => {
    if (approveStatus === approveAllowanceInfo.status) return;
    dispatch(updateApproveStatus(approveStatus));
  }, [approveStatus, INPUT]);

  useEffect(() => {
    if (approveStatus !== ApproveStatus.APPROVAL_NEEDED) return;
    if (approveTransactionInfo.to === INPUT.address) return;
    dispatch(fetchApproveTransaction({ approveInfo: { tokenAddress: INPUT.address }, chainId }));
  }, [approveStatus, INPUT]);

  const approve = useCallback(async () => {
    if (!approveTransactionInfo.data || !account || !chainId || !INPUT.address) return;

    try {
      if (!library) return;
      dispatch(setTxErrorMessage(''));
      dispatch(setIsWaitingTx(true));
      const signer = library.getSigner(account).connectUnchecked();
      const txData = {
        ...approveTransactionInfo,
        gasPrice: gasPriceInfo?.price,
      };
      const tx = await signer.sendTransaction(txData);

      await tx.wait();

      const updatedBalance = await getTokenInfo(library, chainId, [INPUT.address], spender.address, account);
      dispatch(setLastTxHash(tx.hash));
      updatedBalance && dispatch(updateTokenInfo(updatedBalance));
    } catch ({ message }) {
      dispatch(setTxErrorMessage(message));
      console.error('Attempt to send transaction failed:', message);
      return { error: message };
    }
  }, [approveTransactionInfo.data, approveTransactionInfo.to, approveTransactionInfo.gasPrice]);

  return { status: approveStatus, approve };
}
