import { TransactionRequest } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { getTokenInfo, updateAllTokenBalances } from '../tokens';
import { setIsWaitingTx, setLastTxHash, setTxErrorMessage } from '../transactions';

export function useSwapCallback(swapTxInfo: TransactionRequest) {
  const dispatch = useAppDispatch();
  const { provider, account, chainId } = useWeb3React();
  const { INPUT, OUTPUT, spender } = useAppSelector((state) => ({
    INPUT: state.swap.INPUT,
    OUTPUT: state.swap.OUTPUT,
    spender: state.approve.spender,
  }));

  const swapCallback = async () => {
    if (!chainId || !INPUT || !OUTPUT || !account || !provider) return;

    try {
      dispatch(setTxErrorMessage(''));
      dispatch(setIsWaitingTx(true));
      const signer = provider.getSigner(account);
      const tx = await signer.sendTransaction(swapTxInfo);

      await tx.wait();
      if (tx.hash) {
        const updatedBalance = await getTokenInfo(
          provider,
          chainId,
          [INPUT, OUTPUT, '0x0000000000000000000000000000000000000000'],
          spender.address,
          account
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
