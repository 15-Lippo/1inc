import { TransactionRequest } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { getTokenInfo } from '../tokens/balances';
import { updateTokenInfo } from '../tokens/tokensSlice';
import { setIsWaitingTx, setLastTxHash, setTxErrorMessage } from '../transactions/txSlice';

export function useSwapCallback(swapTxInfo: TransactionRequest) {
  const dispatch = useAppDispatch();
  const { library, account, chainId } = useWeb3React();
  const { INPUT, spender } = useAppSelector((state) => ({
    INPUT: state.swap.INPUT,
    spender: state.approve.spender,
  }));

  const swapCallback = async () => {
    if (!chainId || !INPUT || !account) return;

    try {
      dispatch(setIsWaitingTx(true));
      const signer = library.getSigner(account);
      const tx = await signer.sendTransaction(swapTxInfo);

      await tx.wait();

      const updatedBalance = await getTokenInfo(
        library,
        account,
        chainId,
        [INPUT],
        spender.address
      );
      dispatch(setLastTxHash(tx.hash));
      dispatch(updateTokenInfo(updatedBalance[INPUT]));
    } catch ({ message }) {
      dispatch(setTxErrorMessage(message));
      console.error('Attempt to send transaction failed:', message);
      return { error: message };
    }
  };

  return swapCallback;
}
