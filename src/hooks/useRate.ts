import { formatUnits } from '@ethersproject/units';
import { useMemo } from 'react';

import { useAppSelector } from '../store';
import { bigFloatToFixed } from '../utils';

export const useRate = (inputAmount: string, outputAmount: string) => {
  const { INPUT, OUTPUT } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap.INPUT],
    OUTPUT: state.tokens.tokens[state.swap.OUTPUT],
  }));

  return useMemo(() => {
    if (!INPUT || !OUTPUT) {
      return {
        input: '0',
        output: '0',
      };
    }

    const inputAmountNumber = parseFloat(formatUnits(inputAmount, INPUT.decimals));
    const outputAmountNumber = parseFloat(formatUnits(outputAmount, OUTPUT.decimals));

    if (!inputAmountNumber || !outputAmountNumber) {
      return {
        input: '0',
        output: '0',
      };
    }

    return {
      input: bigFloatToFixed(String(outputAmountNumber / inputAmountNumber), 6),
      output: bigFloatToFixed(String(inputAmountNumber / outputAmountNumber), 6),
    };
  }, [inputAmount, outputAmount, INPUT, OUTPUT]);
};
