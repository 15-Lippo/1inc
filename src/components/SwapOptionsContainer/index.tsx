import { formatUnits } from '@ethersproject/units';
import { Grid } from '@mui/material';
import React from 'react';

import { Tokens } from '../../constants';
import { useAppSelector, useUsdStablecoins } from '../../store';
import SwapOptionItem from '../SwapOptionItem';

const SwapOptionsContainer = () => {
  const { quoteInfo, loadingQuote, txFeeCalculation } = useAppSelector((state) => state.swap);
  const tokens = useAppSelector((state) => state.tokens.tokens);
  const { defaultStablecoin } = useUsdStablecoins();
  const typedValue = useAppSelector((state) => state.swap.typedValue);

  const createQuoteInfoLabel = (toTokenAmount?: string, decimals?: number) => {
    if (!toTokenAmount || !decimals) return '';

    return parseFloat(formatUnits(toTokenAmount, decimals)).toFixed(6);
  };

  const createTxCostLabel = (txFee?: string) => {
    const nativeToken = tokens[Tokens.NATIVE_TOKEN_ADDRESS];
    if (!txFee || !defaultStablecoin || !nativeToken?.priceInUsd) {
      return '';
    }

    const txCostInNativeToken = parseFloat(formatUnits(txFee, nativeToken.decimals));
    const nativeTokenPriceInUsd = parseFloat(formatUnits(nativeToken.priceInUsd, defaultStablecoin.decimals));
    const txCostInUsd = txCostInNativeToken * nativeTokenPriceInUsd;
    return `${txCostInNativeToken.toFixed(4)} Ξ (~$${txCostInUsd.toFixed(2)})`;
  };

  const createSwapOptionItemLabels = (toTokenAmount?: string, toTokenDecimals?: number, txFee?: string) => {
    if (!Number(typedValue) || loadingQuote !== 'succeeded') return { txCost: '', quote: '' };

    return {
      txCost: createTxCostLabel(txFee),
      quote: createQuoteInfoLabel(toTokenAmount, toTokenDecimals),
    };
  };

  const oneInchItemLabels = createSwapOptionItemLabels(
    quoteInfo?.toTokenAmount,
    quoteInfo?.toToken?.decimals,
    txFeeCalculation?.txFee
  );

  // const uniswapLabels = createSwapOptionItemLabels(
  //   ...
  // )

  return (
    <Grid container direction="column" rowGap={1.7}>
      <Grid item>
        <SwapOptionItem
          optionName="1inch"
          isBestQuote={true}
          onClick={() => console.log('Selected 1inch')}
          quoteLabel={oneInchItemLabels.quote}
          txCostLabel={oneInchItemLabels.txCost}
        />
      </Grid>
      {/*<Grid item>*/}
      {/*  <SwapOptionItem*/}
      {/*    optionName="Uniswap"*/}
      {/*    isBestQuote={true}*/}
      {/*    onClick={() => alert('Selected Uniswap')}*/}
      {/*    quoteLabel={'placeholder'}*/}
      {/*    txCostLabel={'0.1337'}*/}
      {/*  />*/}
      {/*</Grid>*/}
    </Grid>
  );
};

export default SwapOptionsContainer;
