import { SupportedChainId } from '../../../constants';
import { useActiveWeb3React } from '../../../packages/web3-provider';
import { Field } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useTokenPricesInUsd } from '../tokens/useTokenPricesInUsd';
import { fetchQuote } from './swapSlice';

export const useUpdateQuote = () => {
  const { chainId } = useActiveWeb3React();
  const dispatch = useAppDispatch();
  const { INPUT, OUTPUT, typedValue, gasLimit, referrerOptions } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap[Field.INPUT]] || {},
    OUTPUT: state.tokens.tokens[state.swap[Field.OUTPUT]] || {},
    typedValue: state.swap.typedValue || '0',
    gasLimit: state.swap.txFeeCalculation?.gasLimit,
    referrerOptions: state.swap.referrerOptions,
  }));
  const { updateUsdcPriceForSelectedTokens } = useTokenPricesInUsd();

  return () => {
    if (!Number(typedValue)) return;

    dispatch(
      fetchQuote({
        quoteInfo: {
          fromTokenAddress: INPUT.address,
          toTokenAddress: OUTPUT.address,
          amount: typedValue,
          gasLimit,
          ...(referrerOptions[chainId as SupportedChainId]?.referrerAddress
            ? { fee: referrerOptions[chainId as SupportedChainId].fee }
            : {}),
        },
        chainId,
      })
    );

    updateUsdcPriceForSelectedTokens();
  };
};
