import { formatUnits } from '@ethersproject/units';
import { Grid } from '@mui/material';
import React from 'react';

import { ProtocolName } from '../../constants/protocolNames';
import { NATIVE_TOKEN_ADDRESS } from '../../constants/tokens';
import { useAppDispatch, useAppSelector, useUsdStablecoins } from '../../store';
import { selectSwapMethod } from '../../store/state/swap/swapSlice';
import { Field } from '../../types';
import { calculateTxFee } from '../../utils';
import SwapOptionItem from '../SwapOptionItem';

const SwapOptionsContainer = () => {
  const { defaultStablecoin } = useUsdStablecoins();
  const dispatch = useAppDispatch();
  const nativeToken = useAppSelector((state) => state.tokens.tokens[NATIVE_TOKEN_ADDRESS]);
  const loadingQuote = useAppSelector((state) => state.swap.loadingQuote);
  const toToken = useAppSelector((state) => state.tokens.tokens[state.swap[Field.OUTPUT]]);
  const selectedMethod = useAppSelector((state) => state.swap.selectedMethod);
  const typedValue = useAppSelector((state) => state.swap.typedValue);
  const oneInchQuoteInfo = useAppSelector((state) => state.swap.swapData[ProtocolName.ONE_INCH]);
  const uniswapQuoteInfo = useAppSelector((state) => state.swap.swapData[ProtocolName.UNISWAP_V3]);
  const gasPrice = useAppSelector((state) => state.swap.txFeeCalculation.gasPriceInfo.price);

  const createQuoteInfoLabel = (toTokenAmount?: string, decimals?: number) => {
    if (!toTokenAmount || !decimals) return '';
    return parseFloat(formatUnits(toTokenAmount, decimals)).toFixed(6);
  };

  const createTxCostLabel = (txFee?: string) => {
    if (!txFee || !defaultStablecoin || !nativeToken?.priceInUsd) {
      return '';
    }
    const txCostInNativeToken = parseFloat(formatUnits(txFee, nativeToken.decimals));
    const nativeTokenPriceInUsd = parseFloat(formatUnits(nativeToken.priceInUsd, defaultStablecoin.decimals));
    const txCostInUsd = txCostInNativeToken * nativeTokenPriceInUsd;
    return `${txCostInNativeToken.toFixed(4)} Ξ (~$${txCostInUsd.toFixed(2)})`;
  };

  const createSwapOptionItemLabels = (
    toTokenAmount?: string,
    toTokenDecimals?: number,
    gasPrice?: string,
    gasLimit?: string
  ) => {
    if (!Number(typedValue) || loadingQuote !== 'succeeded' || !gasPrice || !gasLimit) return { txCost: '', quote: '' };

    return {
      txCost: createTxCostLabel(calculateTxFee(gasLimit, gasPrice)),
      quote: createQuoteInfoLabel(toTokenAmount, toTokenDecimals),
    };
  };

  const oneInchItemLabels = createSwapOptionItemLabels(
    oneInchQuoteInfo?.toTokenAmount,
    toToken?.decimals,
    oneInchQuoteInfo?.estimatedGas,
    gasPrice
  );

  const uniswapLabels = createSwapOptionItemLabels(
    uniswapQuoteInfo?.toTokenAmount,
    toToken?.decimals,
    uniswapQuoteInfo?.estimatedGas,
    gasPrice
  );

  const createSwapOptionClickHandler = (protocolName: string) => {
    return () => {
      if (protocolName !== selectedMethod) {
        dispatch(selectSwapMethod(protocolName));
      }
    };
  };

  return (
    <Grid container direction="column" rowGap={1.7}>
      <Grid item>
        <SwapOptionItem
          optionName={ProtocolName.ONE_INCH}
          onClick={createSwapOptionClickHandler(ProtocolName.ONE_INCH)}
          isBestQuote={ProtocolName.ONE_INCH === selectedMethod}
          quoteLabel={oneInchItemLabels.quote}
          txCostLabel={oneInchItemLabels.txCost}
        />
      </Grid>
      <Grid item>
        <SwapOptionItem
          optionName={ProtocolName.UNISWAP_V3}
          onClick={createSwapOptionClickHandler(ProtocolName.UNISWAP_V3)}
          isBestQuote={ProtocolName.UNISWAP_V3 === selectedMethod}
          quoteLabel={uniswapLabels.quote}
          txCostLabel={uniswapLabels.txCost}
        />
      </Grid>
    </Grid>
  );
};

export default SwapOptionsContainer;
