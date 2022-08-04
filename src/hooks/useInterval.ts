import { useEffect, useRef } from 'react';

export const useInterval = (callback: any, delay: number) => {
  const callbackRef = useRef();
  const intervalRef = useRef<NodeJS.Timer>();

  // update callback function with current render callback that has access to latest props and state
  useEffect(() => {
    callbackRef.current = callback;
  });

  const startInterval = () =>
    setInterval(() => {
      // @ts-ignore
      callbackRef.current && callbackRef.current();
    }, delay);

  const stopInterval = () => clearInterval(intervalRef.current);

  const restartInterval = (runBeforeDelay = false) => {
    clearInterval(intervalRef.current);
    if (runBeforeDelay) {
      // @ts-ignore
      callbackRef.current && callbackRef.current();
    }
    intervalRef.current = startInterval();
  };

  useEffect(() => {
    if (!delay) {
      return;
    }

    intervalRef.current = startInterval();
    return () => clearInterval(intervalRef.current);
  }, [delay]);

  return {
    restartInterval,
    stopInterval,
  };
};
