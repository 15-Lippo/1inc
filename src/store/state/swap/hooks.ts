import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchQuote } from './swapSlice';

const DELAY = 15;

export const useCountdownQuote = () => {
  const dispatch = useAppDispatch();
  const { INPUT, OUTPUT, typedValue } = useAppSelector((state) => state.swap);
  const [countdown, setCountdown] = useState<number>(DELAY);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else if (countdown === 0) {
        dispatch(
          fetchQuote({
            fromTokenAddress: INPUT.currency.address,
            toTokenAddress: OUTPUT.currency.address,
            amount: typedValue,
          })
        );
        setCountdown(DELAY);
      }
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [countdown, dispatch]);

  return countdown;
};
