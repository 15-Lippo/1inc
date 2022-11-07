import { Interface } from '@ethersproject/abi';
import { TransactionRequest } from '@ethersproject/providers';
import { MaxUint256 } from '@uniswap/sdk-core';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect } from 'react';

import ERC20ABI from '../../abi/ERC20ABI';
import { V3_SWAP_ROUTER_ADDRESS } from '../../constants';
import { ProtocolName } from '../../constants/protocolNames';
import { ZERO_ADDRESS } from '../../constants/tokens';
import { fetchOneInchApproveTx } from '../../services';
import {
  fetchApproveSpender,
  getTokenInfo,
  setIsWaitingTx,
  setTxErrorMessage,
  updateTokenInfo,
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { getTxStatus, TxStatusType } from '../../utils';
import { ITxStatus } from '../../utils/txStatus';
import { useUpdateAllowance } from './useUpdateAllowance';

// this allows balances to work, should be removed at the end
export function useUpdateSpender() {
  const dispatch = useAppDispatch();
  const { chainId } = useWeb3React();
  const spender = useAppSelector((state) => state.approve.spender);

  useEffect(() => {
    if (spender.address) return;
    dispatch(fetchApproveSpender(chainId));
  }, [spender.address]);
}

interface GetApproveTxParams {
  selectedMethod: string;
  chainId: number;
  from: string;
  to: string;
}

async function createApproveTx({ selectedMethod, to, chainId, from }: GetApproveTxParams): Promise<TransactionRequest> {
  const approveTxCreators = {
    [ProtocolName.ONE_INCH]: async () =>
      await fetchOneInchApproveTx({
        tokenAddress: to,
        chainId,
      }),
    [ProtocolName.UNISWAP_V3]: async () => {
      const ierc20 = new Interface(ERC20ABI);
      return {
        data: ierc20.encodeFunctionData('approve', [V3_SWAP_ROUTER_ADDRESS, MaxUint256.toString()]),
        value: '0',
        to,
      };
    },
  };

  const txCreator = approveTxCreators[selectedMethod];

  if (!txCreator) {
    throw new Error(`No approval transaction creator for selected method: ${selectedMethod}`);
  }

  const txReq: TransactionRequest = await txCreator();
  txReq.from = from;

  // TODO add gas price

  return txReq;
}

export const useApprove = () => {
  const dispatch = useAppDispatch();
  const { provider, account, chainId } = useWeb3React();
  const INPUT = useAppSelector((state) => state.tokens.tokens[state.swap.INPUT]);
  const selectedMethod = useAppSelector((state) => state.swap.selectedMethod);
  const updateAllowance = useUpdateAllowance(selectedMethod);

  const approve = useCallback(async () => {
    if (!provider || !account || !chainId || !INPUT?.address) return;

    try {
      dispatch(setTxErrorMessage(''));
      dispatch(setIsWaitingTx(true));

      const txReq = await createApproveTx({ selectedMethod, to: INPUT.address, chainId, from: account });

      console.log('Sending approve tx: ', txReq);
      const signer = provider.getSigner(account).connectUnchecked();
      const tx = await signer.sendTransaction(txReq);
      await tx.wait();

      if (tx.hash) {
        dispatch(setIsWaitingTx(false));
        await getTxStatus(tx.hash, provider, (txStatus: ITxStatus) => {
          const typeToStatus = {
            [TxStatusType.SUCCESSFUL]: async () => {
              const updatedNativeTokenInfo = await getTokenInfo(
                provider,
                chainId,
                [ZERO_ADDRESS],
                txReq.to || '',
                account
              );
              updatedNativeTokenInfo && dispatch(updateTokenInfo(updatedNativeTokenInfo));
              updateAllowance();
            },
            [TxStatusType.REVERTED]: async () => {
              return { error: txStatus.error };
            },
            [TxStatusType.PENDING]: async () => {
              console.log('PENDING');
            },
          };
          typeToStatus[txStatus.status]();
        });
      }
    } catch (error) {
      dispatch(setTxErrorMessage(error.message));
      console.error('Attempt to send transaction failed:', error);
      return { error };
    }
  }, [provider, account, chainId, INPUT?.address, selectedMethod, updateAllowance]);

  return { approve, updateAllowance };
};
