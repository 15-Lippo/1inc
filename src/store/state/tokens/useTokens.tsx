import { useEffect, useMemo } from 'react';

import { useActiveWeb3React } from '../../../packages/web3-provider';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getTokenBalances } from './balances';
import { fetchTokens, updateAllTokenBalances } from './tokensSlice';

export const useTokens = () => {
  const { library, account, chainId } = useActiveWeb3React();
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
    if (addresses.length) return;
    console.log('tokens...');
    dispatch(fetchTokens());
    console.log('...tokens');
  }, []);

  useEffect(() => {
    if (!account || !addresses.length || !chainId || !spender.address) return;

    console.log('balances...');
    const getBalances = async () => {
      const result = await getTokenBalances(library, account, chainId, addresses, spender.address);
      dispatch(updateAllTokenBalances(result));
    };

    getBalances();
    console.log('...balances');
  }, [account, spender.address, chainId, countOfTokens]);

  return { tokens, addresses };
};
