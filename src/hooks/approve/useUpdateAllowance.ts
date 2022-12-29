import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';

import { ProtocolName } from '../../constants/protocolNames';
import { getJoeRouterAllowance, getOneInchAllowance, getUniswapAllowance } from '../../services';
import { AllowanceParams } from '../../services/types';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateSingleAllowance } from '../../store/state/approve/approveSlice';
import { Field } from '../../types';

const allowanceUpdaters: { [protocolName: string]: (params: AllowanceParams) => Promise<string> } = {
  [ProtocolName.ONE_INCH]: getOneInchAllowance,
  [ProtocolName.UNISWAP_V3]: getUniswapAllowance,
  [ProtocolName.JOE_ROUTER]: getJoeRouterAllowance,
};

function getAllowanceUpdater(method: string) {
  const updater = allowanceUpdaters[method];

  if (!updater) {
    throw new Error(`Allowance updater for method ${method} not found!`);
  }

  return updater;
}

export const useUpdateAllowance = (selectedMethod: string) => {
  const { provider, chainId, account } = useWeb3React();
  const dispatch = useAppDispatch();
  const tokenAddress = useAppSelector((state) => state.swap[Field.INPUT]);

  return useCallback(() => {
    if (!provider || !chainId || !account || !tokenAddress) return;
    const updateAllowance = getAllowanceUpdater(selectedMethod);
    dispatch(
      updateSingleAllowance(async () => {
        try {
          return await updateAllowance({
            provider,
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
  }, [provider, chainId, account, tokenAddress, selectedMethod]);
};
