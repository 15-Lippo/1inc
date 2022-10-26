import { Contract } from '@ethersproject/contracts';
import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';

import { getContract } from '../utils';

export function useContract<T extends Contract = Contract>(
  address: string | undefined,
  abi: any,
  signer = true
): T | null {
  const { provider, account, chainId } = useWeb3React();

  return useMemo(() => {
    if (!address || !provider || !chainId) return null;
    try {
      return getContract(address, abi, provider, signer && account ? account : undefined);
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [address, provider, chainId, signer, account]) as T;
}
