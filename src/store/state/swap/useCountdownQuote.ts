import { useWeb3React } from '@web3-react/core';
import { useEffect, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchQuote } from './swapSlice';

const DELAY = 15;

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
  const { chainId } = useWeb3React();
  const { INPUT, OUTPUT, typedValue } = useAppSelector((state) => state.swap);
  const [countdown, setCountdown] = useState<number>(DELAY);

  useEffect(() => {
    setCountdown(0);
  }, [INPUT, OUTPUT, typedValue, chainId]);

  useInterval(() => {
    setCountdown(countdown - 1);

    if (countdown === 0) {
      setCountdown(DELAY);

      if (!typedValue) return;

      dispatch(
        fetchQuote({
          quoteInfo: {
            fromTokenAddress: INPUT,
            toTokenAddress: OUTPUT,
            amount: typedValue,
          },
          isTokenPriceInUsd: true,
        })
      );
    }
  }, 1000);

  const reset = () => {
    setCountdown(0);
  };

  return { countdown, reset };
};
