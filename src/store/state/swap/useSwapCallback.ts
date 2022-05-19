import { TransactionRequest } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useState } from 'react';

import { useAppSelector } from '../../hooks';

export function useSwapCallback(swapTxInfo: TransactionRequest) {
  const { library, account, chainId } = useWeb3React();
  const { INPUT } = useAppSelector((state) => state.swap);
  const [txHash, setTxHash] = useState<string | undefined>();

  const swapCallback = async () => {
    if (!chainId) {
      return console.warn('No chainId');
    } else if (!INPUT) {
      return console.warn('No token');
    }

    try {
      const signer = library.getSigner(account);
      const tx = await signer.sendTransaction(swapTxInfo);
      const result = await tx.wait();
      if (result) {
        setTxHash(result.transactionHash);
        return {
          error: null,
          ...result,
        };
      }
    } catch ({ message }) {
      console.error('Attempt to send transaction failed:', message);
      return { error: message };
    }
  };

  return swapCallback;
}
