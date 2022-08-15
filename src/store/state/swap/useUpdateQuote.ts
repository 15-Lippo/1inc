import { useActiveWeb3React } from '../../../packages/web3-provider';
import { Field, SupportedChainId } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useUpdateUsdcPriceForSelectedTokens } from '../tokens/prices-in-usd/useTokenPricesInUsd';
import { fetchQuote } from './swapSlice';

export const useUpdateQuote = () => {
  const { chainId } = useActiveWeb3React();
  const dispatch = useAppDispatch();
  const { INPUT, OUTPUT, typedValue, referrerOptions, txFeeCalculation } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap[Field.INPUT]] || {},
    OUTPUT: state.tokens.tokens[state.swap[Field.OUTPUT]] || {},
    typedValue: state.swap.typedValue || '0',
    referrerOptions: state.swap.referrerOptions,
    txFeeCalculation: state.swap.txFeeCalculation,
  }));

  const updateUsdcPriceForSelectedTokens = useUpdateUsdcPriceForSelectedTokens();

  return () => {
    if (!Number(typedValue) || !Number(txFeeCalculation?.gasPriceInfo?.price) || !INPUT.address || !OUTPUT.address)
      return;

    dispatch(
      fetchQuote({
        quoteInfo: {
          fromTokenAddress: INPUT.address,
          toTokenAddress: OUTPUT.address,
          amount: typedValue.toString(),
          gasPrice: Number(txFeeCalculation?.customGasPrice?.maxFee)
            ? txFeeCalculation?.customGasPrice?.maxFee
            : txFeeCalculation?.gasPriceInfo?.price,
          // gasLimit: txFeeCalculation?.gasLimit,
          fee: referrerOptions[chainId as SupportedChainId]?.fee,
        },
        chainId,
      })
    );

    updateUsdcPriceForSelectedTokens();
  };
};
