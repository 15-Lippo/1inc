import { useEffect, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchQuote } from './swapSlice';

const DELAY = 15;

function useInterval(callback: any, delay: number) {
  const callbacRef = useRef();

  // update callback function with current render callback that has access to latest props and state
  useEffect(() => {
    callbacRef.current = callback;
  });

  useEffect(() => {
    if (!delay) {
      return;
    }

    const interval = setInterval(() => {
      // @ts-ignore
      callbacRef.current && callbacRef.current();
    }, delay);
    return () => clearInterval(interval);
  }, [delay]);
}

export const useCountdownQuote = () => {
  const dispatch = useAppDispatch();
  const { INPUT, OUTPUT, typedValue } = useAppSelector((state) => state.swap);
  const [countdown, setCountdown] = useState<number>(DELAY);

  useEffect(() => {
    setCountdown(0);
  }, [typedValue]);

  useInterval(() => {
    setCountdown(countdown - 1);

    if (countdown === 0) {
      setCountdown(DELAY);

      if (!typedValue) return;

      dispatch(
        fetchQuote({
          fromTokenAddress: INPUT,
          toTokenAddress: OUTPUT,
          amount: typedValue,
        })
      );
    }
  }, 1000);

  const reset = () => {
    setCountdown(0);
  };

  return { countdown, reset };
};
