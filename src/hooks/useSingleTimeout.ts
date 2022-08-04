import { useEffect, useRef } from 'react';

export const useSingleTimeout = (callback: any, delay: number) => {
  const timoutRef = useRef<NodeJS.Timeout>();

  const startTimeout = () => {
    clearTimeout(timoutRef.current);
    timoutRef.current = setTimeout(callback, delay);
  };

  const abortTimeout = () => {
    clearTimeout(timoutRef.current);
  };

  useEffect(() => {
    return abortTimeout();
  }, []);

  return { startTimeout, abortTimeout };
};
