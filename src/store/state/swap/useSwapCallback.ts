import { TransactionRequest } from '@ethersproject/providers';

import { useActiveWeb3React } from '../../../packages';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getTokenInfo, updateAllTokenBalances } from '../tokens';
import { setIsWaitingTx, setLastTxHash, setTxErrorMessage } from '../transactions';

export function useSwapCallback(swapTxInfo: TransactionRequest) {
  const dispatch = useAppDispatch();
  const { library, account, chainId } = useActiveWeb3React();
  const { INPUT, OUTPUT, spender } = useAppSelector((state) => ({
    INPUT: state.swap.INPUT,
    OUTPUT: state.swap.OUTPUT,
    spender: state.approve.spender,
  }));

  const swapCallback = async () => {
    if (!chainId || !INPUT || !OUTPUT || !account || !library) return;

    try {
      dispatch(setTxErrorMessage(''));
      dispatch(setIsWaitingTx(true));
      const signer = library.getSigner(account);
      const tx = await signer.sendTransaction(swapTxInfo);

      await tx.wait();
      if (tx.hash) {
        const updatedBalance = await getTokenInfo(
          library,
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
