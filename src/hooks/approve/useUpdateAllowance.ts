import { useCallback } from 'react';

import { ProtocolName } from '../../constants/protocolNames';
import { useActiveWeb3React } from '../../packages';
import { getOneInchAllowance } from '../../services';
import { AllowanceParams } from '../../services/types';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateSingleAllowance } from '../../store/state/approve/approveSlice';
import { Field } from '../../types';

const allowanceUpdaters: { [protocolName: string]: (params: AllowanceParams) => Promise<string> } = {
  [ProtocolName.ONE_INCH]: getOneInchAllowance,
};

function getAllowanceUpdater(method: string) {
  const updater = allowanceUpdaters[method];

  if (!updater) {
    throw new Error(`Allowance updater for method ${method} not found!`);
  }

  return updater;
}

export const useUpdateAllowance = (selectedMethod: string) => {
  const { library, chainId, account } = useActiveWeb3React();
  const dispatch = useAppDispatch();
  const tokenAddress = useAppSelector((state) => state.swap[Field.INPUT]);

  return useCallback(() => {
    if (!library || !chainId || !account || !tokenAddress) {
      return;
    }
    const updateAllowance = getAllowanceUpdater(selectedMethod);
    dispatch(
      updateSingleAllowance(async () => {
        try {
          return await updateAllowance({
            library,
            tokenAddress,
            chainId,
            account,
          });
        } catch (e) {
          console.error(e);
          throw e;
        }
      })
    );
  }, [library, chainId, account, tokenAddress, selectedMethod]);
};
