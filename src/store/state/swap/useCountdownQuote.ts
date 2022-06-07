import { useWeb3React } from '@web3-react/core';
import { useEffect, useRef, useState } from 'react';

import { REFRESH_QUOTE_DELAY } from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchQuote, Field } from './swapSlice';

function useInterval(callback: any, delay: number) {
  const callbackRef = useRef();

  // update callback function with current render callback that has access to latest props and state
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    if (!delay) {
      return;
    }

    const interval = setInterval(() => {
      // @ts-ignore
      callbackRef.current && callbackRef.current();
    }, delay);
    return () => clearInterval(interval);
  }, [delay]);
}

export const useCountdownQuote = () => {
  const dispatch = useAppDispatch();
  const { chainId, account } = useWeb3React();
  const { INPUT, OUTPUT, typedValue, gasLimit } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap[Field.INPUT]] || {},
    OUTPUT: state.tokens.tokens[state.swap[Field.OUTPUT]] || {},
    typedValue: state.swap.typedValue || '0',
    gasLimit: state.swap.txFeeCalculation?.gasLimit,
  }));
  const [countdown, setCountdown] = useState<number>(REFRESH_QUOTE_DELAY);

  useEffect(() => {
    setCountdown(0);
  }, [INPUT?.address, OUTPUT?.address, typedValue, chainId, account]);

  useInterval(() => {
    setCountdown(countdown - 1);

    if (countdown === 0) {
      setCountdown(REFRESH_QUOTE_DELAY);

      if (!Number(typedValue)) return;

      dispatch(
        fetchQuote({
          quoteInfo: {
            fromTokenAddress: INPUT.address,
            toTokenAddress: OUTPUT.address,
            amount: typedValue,
            gasLimit,
          },
          isTokenPriceInUsd: true,
          fromTokenDecimals: INPUT.decimals,
          toTokenDecimals: OUTPUT.decimals,
        })
      );
    }
  }, 1000);

  const reset = () => {
    setCountdown(0);
  };

  return { countdown, reset };
};
