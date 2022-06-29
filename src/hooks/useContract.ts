import { Contract } from '@ethersproject/contracts';
import { useMemo } from 'react';

import { getContract } from '../utils/contract';
import useActiveWeb3React from './useActiveWeb3React';

export function useContract<T extends Contract = Contract>(
  address: string | undefined,
  abi: any,
  signer = true
): T | null {
  const { library, account, chainId } = useActiveWeb3React();

  return useMemo(() => {
    if (!address || !library || !chainId) return null;
    try {
      return getContract(address, abi, library, signer && account ? account : undefined);
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [address, library, chainId, signer, account]) as T;
}
