import { useWeb3React } from '@web3-react/core';
import { useEffect, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { getTokenBalances } from './balances';
import { fetchTokens, updateAllTokenBalances } from './tokensSlice';

export const useTokens = () => {
  const { provider, account, chainId } = useWeb3React();
  const dispatch = useAppDispatch();
  const { tokens, spender } = useAppSelector((state) => ({
    tokens: state.tokens.tokens,
    // tokenInfoFetched: state.tokens.tokenInfoFetched,
    spender: state.approve.spender,
  }));

  // track count of tokens to update balances after an import new custom token to the main list
  const countOfTokens = Object.keys(tokens).length;

  const addresses = useMemo(() => Object.keys(tokens), [JSON.stringify(tokens)]);

  useEffect(() => {
    if (!chainId) return;
    dispatch(fetchTokens(chainId));
  }, [chainId]);

  useEffect(() => {
    if (!addresses.length || !chainId || !spender.address) return;
    const getBalances = async () => {
      const result = await getTokenBalances(provider, chainId, addresses, spender.address, account);
      dispatch(updateAllTokenBalances(result));
    };

    getBalances();
  }, [account, spender.address, chainId, countOfTokens]);

  return { tokens, addresses };
};
