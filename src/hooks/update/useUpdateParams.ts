import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';

import { UpdateQuoteParams } from '../../services/types';
import { useAppSelector } from '../../store';
import { Field } from '../../types';

export const useUpdateParams = (): UpdateQuoteParams | undefined => {
  const fromToken = useAppSelector((state) => state.tokens.tokens[state.swap[Field.INPUT]]);
  const toToken = useAppSelector((state) => state.tokens.tokens[state.swap[Field.OUTPUT]]);
  const slippage = useAppSelector((state) => state.swap.slippage);
  const amount = useAppSelector((state) => state.swap.typedValue);

  const { account, chainId, provider } = useWeb3React();

  const referrerOptionsByChainId = useAppSelector((state) => state.swap.referrerOptions[Number(chainId)]);

  return useMemo(() => {
    if (!chainId || !provider || !fromToken || !toToken || !amount) {
      return undefined;
    }

    const { address: fromTokenAddress, decimals: fromTokenDecimals } = fromToken;
    const { address: toTokenAddress, decimals: toTokenDecimals } = toToken;

    let referrerAddress: string | undefined;
    let fee: string | undefined;

    if (referrerOptionsByChainId) {
      referrerAddress = referrerOptionsByChainId.referrerAddress;
      fee = referrerOptionsByChainId.fee;
    }

    return {
      fromTokenAddress,
      toTokenAddress,
      fromTokenDecimals,
      toTokenDecimals,
      slippage,
      amount: String(amount),
      fromAddress: account,
      chainId,
      provider,
      referrerAddress,
      fee,
    };
  }, [fromToken?.address, toToken?.address, slippage, amount, referrerOptionsByChainId, account, chainId, provider]);
};
