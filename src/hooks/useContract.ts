import { Contract } from '@ethersproject/contracts';
import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';

import ERC20_ABI from '../abi/ERC20ABI.json';
import { getContract } from '../utils/contract';

export function useContract<T extends Contract = Contract>(
  address: string | undefined,
  signer = true
): T | null {
  const { library, account, chainId } = useWeb3React();

  return useMemo(() => {
    if (!address || !library || !chainId) return null;
    try {
      return getContract(address, ERC20_ABI, library, signer && account ? account : undefined);
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [address, library, chainId, signer, account]) as T;
}
