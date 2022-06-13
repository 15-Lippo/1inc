import { TransactionRequest } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { getTokenInfo } from '../tokens/balances';
import { updateAllTokenBalances } from '../tokens/tokensSlice';
import { setIsWaitingTx, setLastTxHash, setTxErrorMessage } from '../transactions/txSlice';

export function useSwapCallback(swapTxInfo: TransactionRequest) {
  const dispatch = useAppDispatch();
  const { library, account, chainId } = useWeb3React();
  const { INPUT, OUTPUT, spender } = useAppSelector((state) => ({
    INPUT: state.swap.INPUT,
    OUTPUT: state.swap.OUTPUT,
    spender: state.approve.spender,
  }));

  const swapCallback = async () => {
    if (!chainId || !INPUT || !OUTPUT || !account) return;

    try {
      dispatch(setIsWaitingTx(true));
      const signer = library.getSigner(account);
      const tx = await signer.sendTransaction(swapTxInfo);

      await tx.wait();
      if (tx.hash) {
        const updatedBalance = await getTokenInfo(
          library,
          account,
          chainId,
          [INPUT, OUTPUT, '0x0000000000000000000000000000000000000000'],
          spender.address
        );
        dispatch(setLastTxHash(tx.hash));
        dispatch(updateAllTokenBalances(updatedBalance));
      }
    } catch ({ message }) {
      dispatch(setTxErrorMessage(message));
      console.error('Attempt to send transaction failed:', message);
      return { error: message };
    }
  };

  return swapCallback;
}
