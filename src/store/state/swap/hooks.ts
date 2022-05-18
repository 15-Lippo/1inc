import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchQuote } from './swapSlice';

const DELAY = 15;

export const useCountdownQuote = (update?: boolean) => {
  const dispatch = useAppDispatch();
  const { INPUT, OUTPUT, typedValue } = useAppSelector((state) => state.swap);
  const [countdown, setCountdown] = useState<number>(DELAY);

  useEffect(() => {
    setCountdown(0);
  }, [typedValue, update]);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else if (countdown === 0) {
        if (typedValue) {
          dispatch(
            fetchQuote({
              fromTokenAddress: INPUT.currency.address,
              toTokenAddress: OUTPUT.currency.address,
              amount: typedValue,
            })
          );
        }
        setCountdown(DELAY);
      }
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [countdown, dispatch]);

  return countdown;
};
