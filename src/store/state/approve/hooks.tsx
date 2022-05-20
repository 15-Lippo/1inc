import { BigNumber } from '@ethersproject/bignumber';
import { TransactionReceipt, Web3Provider } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useMemo, useState } from 'react';

import ERC20_ABI from '../../../abi/ERC20ABI.json';
import { SupportedChainId } from '../../../constants/chains';
import { getContract } from '../../../utils/contract';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Token } from '../tokens/tokensSlice';
import {
  ApproveStatus,
  fetchApproveAllowance,
  fetchApproveTransaction,
  updateAllowanceInfo,
  updateApproveStatus,
} from './approveSlice';

export interface ApproveTransactionResult extends TransactionReceipt {
  value: string;
  data: string;
  gasPrice: string;
  error: null | string;
}

export enum TransactionType {
  APPROVAL = 0,
  SWAP = 1,
}

export function useTokenAllowance(
  token: Token,
  account: string,
  chainId: number,
  library: Web3Provider,
  txHash?: string
) {
  const dispatch = useAppDispatch();
  const { approveSpenderInfo, approveAllowanceInfo } = useAppSelector((state) => state.approve);

  const spender = approveSpenderInfo.address;
  const { allowance } = approveAllowanceInfo;

  const getTokenContractAllowance = async () => {
    const tokenContract = getContract(
      token.address,
      ERC20_ABI,
      library,
      account ? account : undefined
    );
    const contractAllowance = await tokenContract.allowance(account, spender);
    console.log('contractAllowance: ', contractAllowance, 'for', token.symbol);
    dispatch(updateAllowanceInfo(formatUnits(contractAllowance, 0)));
  };

  useEffect(() => {
    if (!token || !account || !chainId) return;
    if (
      chainId === SupportedChainId.LOCALHOST &&
      token.address !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
    ) {
      if (!library || !spender) return;
      getTokenContractAllowance().catch(console.error);
    } else {
      dispatch(
        fetchApproveAllowance({
          tokenAddress: token.address,
          walletAddress: account,
        })
      );
    }
  }, [token, account, txHash]);

  return useMemo(() => (token && allowance ? allowance : undefined), [token, allowance, txHash]);
}

export function useCheckApproveState(txHash?: string) {
  const dispatch = useAppDispatch();
  const { account, chainId, library } = useWeb3React();
  const { INPUT, typedValue } = useAppSelector((state) => state.swap);

  // @ts-ignore
  const currentAllowance = useTokenAllowance(INPUT.currency, account, chainId, library, txHash);

  const approveStatus = useMemo(() => {
    if (!INPUT.currency.address || !account) return ApproveStatus.UNKNOWN;
    // IF IS NATIVE
    if (INPUT.currency.address.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
      return ApproveStatus.APPROVED;

    // if no data to approve:
    if (!currentAllowance) return ApproveStatus.UNKNOWN;
    if (currentAllowance === '0') return ApproveStatus.NOT_APPROVED;

    return BigNumber.from(currentAllowance).lt(BigNumber.from(typedValue || 0))
      ? ApproveStatus.NOT_APPROVED
      : ApproveStatus.APPROVED;
  }, [dispatch, currentAllowance, txHash]);

  return useMemo(() => {
    if (approveStatus === ApproveStatus.NOT_APPROVED) {
      dispatch(fetchApproveTransaction({ tokenAddress: INPUT.currency.address }));
    }
    dispatch(updateApproveStatus(approveStatus));
    return approveStatus;
  }, [approveStatus, INPUT.currency.address, currentAllowance, txHash]);
}

export function useApproval(): [
  ApproveStatus,
  () => Promise<ApproveTransactionResult | { error: any }>
] {
  const { library, account, chainId } = useWeb3React();
  const { INPUT } = useAppSelector((state) => state.swap);
  const { approveTransactionInfo, approveSpenderInfo } = useAppSelector((state) => state.approve);
  const [txHash, setTxHash] = useState<string | undefined>();
  const spender = approveSpenderInfo.address;

  const approvalState = useCheckApproveState(txHash);

  const approve = useCallback(async () => {
    if (approvalState !== ApproveStatus.NOT_APPROVED) {
      return console.warn('Token is not to be approved');
    } else if (!chainId) {
      return console.warn('No chainId');
    } else if (!INPUT) {
      return console.warn('No token');
    } else if (!spender) {
      return console.warn('No spender');
    }

    try {
      const signer = library.getSigner(account).connectUnchecked();
      const tx = await signer.sendTransaction(approveTransactionInfo);
      const result = await tx.wait();
      if (result) {
        setTxHash(result.transactionHash);
        return {
          error: null,
          ...result,
          ...approveTransactionInfo,
        };
      }
    } catch ({ message }) {
      console.error('Attempt to send transaction failed:', message);
      return { error: message };
    }
  }, [approvalState, INPUT, spender, chainId, approveTransactionInfo]);

  return [approvalState, approve];
}
