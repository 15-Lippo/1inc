import { BigNumber } from '@ethersproject/bignumber';
import { useMemo } from 'react';

import { NATIVE_TOKEN_ADDRESS } from '../../constants/tokens';
import { useActiveWeb3React } from '../../packages';
import { ApproveStatus, useAppSelector } from '../../store';
import { Field } from '../../types';

export const useApproveStatus = (): ApproveStatus => {
  const { account } = useActiveWeb3React();
  const { typedValue, allowance, inputAddress, selectedMethod } = useAppSelector((state) => ({
    typedValue: state.swap.typedValue,
    inputAddress: state.swap[Field.INPUT],
    selectedMethod: state.swap.selectedMethod,
    allowance: state.approve.allowance,
  }));

  return useMemo(() => {
    if (!inputAddress || !account || !typedValue || !selectedMethod) return ApproveStatus.UNKNOWN;
    // IF IS NATIVE
    if (inputAddress.toLowerCase() === NATIVE_TOKEN_ADDRESS) {
      return ApproveStatus.NO_APPROVAL_NEEDED;
    }

    // if no data to approve:
    if (!allowance) return ApproveStatus.UNKNOWN;

    return BigNumber.from(allowance).lt(BigNumber.from(typedValue))
      ? ApproveStatus.APPROVAL_NEEDED
      : ApproveStatus.NO_APPROVAL_NEEDED;
  }, [inputAddress, selectedMethod, typedValue, allowance, account]);
};
