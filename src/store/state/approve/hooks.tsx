import { BigNumber } from '@ethersproject/bignumber';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { ApproveStatus, fetchApproveAllowance, updateApproveStatus } from './approveSlice';

export function useCheckApproveState() {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const { INPUT, typedValue } = useAppSelector((state) => state.swap);
  const { allowance } = useAppSelector((state) => state.approve.approveAllowanceInfo);

  useEffect(() => {
    if (INPUT.currency.address && account) {
      dispatch(
        fetchApproveAllowance({
          tokenAddress: INPUT.currency.address,
          walletAddress: account,
        })
      );
    }
  }, [INPUT.currency.address, account, dispatch]);

  const approveStatus = useMemo(() => {
    if (!INPUT.currency.address || !account) return ApproveStatus.UNKNOWN;
    // // IF IS NATIVE
    if (INPUT.currency.address.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
      return ApproveStatus.APPROVED;

    // if no data to approve:
    if (!allowance) return ApproveStatus.UNKNOWN;
    if (allowance === '0') return ApproveStatus.NOT_APPROVED;

    return BigNumber.from(allowance).lt(BigNumber.from(typedValue))
      ? ApproveStatus.NOT_APPROVED
      : ApproveStatus.APPROVED;
  }, [dispatch, allowance]);

  return useMemo(() => {
    dispatch(updateApproveStatus(approveStatus));
  }, [approveStatus]);
}
