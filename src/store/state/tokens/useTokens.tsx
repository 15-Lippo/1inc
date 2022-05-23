import { useWeb3React } from '@web3-react/core';
import { useEffect, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { getTokenBalances } from './balances';
import { fetchTokens, updateAllTokenBalances } from './tokensSlice';

export const useTokens = () => {
  const { library, account, chainId } = useWeb3React();
  const dispatch = useAppDispatch();
  const { tokens, tokenInfoFetched, spender } = useAppSelector((state) => ({
    tokens: state.tokens.tokens,
    tokenInfoFetched: state.tokens.tokenInfoFetched,
    spender: state.approve.spender,
  }));
  const addresses = useMemo(() => Object.keys(tokens), [JSON.stringify(tokens)]);

  useEffect(() => {
    if (addresses.length) return;
    console.log('tokens...');
    dispatch(fetchTokens());
    console.log('...tokens');
  }, []);

  useEffect(() => {
    if (!account || !addresses.length || !chainId || !spender.address || tokenInfoFetched) return;

    console.log('balances...');
    const getBalances = async () => {
      const result = await getTokenBalances(library, account, chainId, addresses, spender.address);
      dispatch(updateAllTokenBalances(result));
    };

    getBalances();
    console.log('...balances');
  }, [account, addresses.length, spender.address, tokenInfoFetched]);

  return { tokens, addresses };
};