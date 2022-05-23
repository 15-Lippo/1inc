import { Contract } from '@ethersproject/contracts';
import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';

import { getContract } from '../utils/contract';

export function useContract<T extends Contract = Contract>(
  address: string | undefined,
  abi: any,
  signer = true
): T | null {
  const { library, account, chainId } = useWeb3React();

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
