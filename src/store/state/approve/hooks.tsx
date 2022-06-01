import { BigNumber } from '@ethersproject/bignumber';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { getTokenInfo } from '../tokens/balances';
import { updateTokenInfo } from '../tokens/tokensSlice';
import { setIsWaitingTx, setLastTxHash, setTxErrorMessage } from '../transactions/txSlice';
import {
  ApproveStatus,
  fetchApproveSpender,
  fetchApproveTransaction,
  updateApproveStatus,
} from './approveSlice';

export function useApproval() {
  const dispatch = useAppDispatch();
  const { library, account, chainId } = useWeb3React();
  const { INPUT, typedValue, approveTransactionInfo, approveAllowanceInfo, spender } =
    useAppSelector((state) => ({
      typedValue: state.swap.typedValue,
      INPUT: state.tokens.tokens[state.swap.INPUT],
      approveTransactionInfo: state.approve.approveTransactionInfo,
      approveAllowanceInfo: state.approve.approveAllowanceInfo,
      spender: state.approve.spender,
    }));

  useEffect(() => {
    if (spender.address) return;
    console.log('spender...');
    dispatch(fetchApproveSpender());
    console.log('...spender');
  }, [spender.address]);

  const approveStatus = useMemo(() => {
    if (!INPUT || !account || !typedValue) return ApproveStatus.UNKNOWN;

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
    dispatch(fetchApproveTransaction({ tokenAddress: INPUT.address }));
  }, [approveStatus, INPUT]);

  const approve = useCallback(async () => {
    if (!approveTransactionInfo.data || !account || !chainId || !INPUT.address) return;

    try {
      dispatch(setIsWaitingTx(true));
      const signer = library.getSigner(account).connectUnchecked();
      const tx = await signer.sendTransaction(approveTransactionInfo);

      await tx.wait();

      const updatedBalance = await getTokenInfo(
        library,
        account,
        chainId,
        [INPUT.address],
        spender.address
      );
      dispatch(setLastTxHash(tx.hash));
      dispatch(updateTokenInfo(updatedBalance[INPUT.address]));
    } catch ({ message }) {
      dispatch(setTxErrorMessage(message));
      console.error('Attempt to send transaction failed:', message);
      return { error: message };
    }
  }, [approveTransactionInfo.data, approveTransactionInfo.to, approveTransactionInfo.gasPrice]);

  return { status: approveStatus, approve };
}
