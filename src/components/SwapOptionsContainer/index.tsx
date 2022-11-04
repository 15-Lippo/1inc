import { formatUnits } from '@ethersproject/units';
import { Grid } from '@mui/material';
import React from 'react';

import { ProtocolName } from '../../constants/protocolNames';
import { INCH_NATIVE_TOKEN_ADDRESS } from '../../constants/tokens';
import { useAppDispatch, useAppSelector, useUsdStablecoins } from '../../store';
import { selectSwapMethod } from '../../store/state/swap/swapSlice';
import { Field } from '../../types';
import { bigFloatToFixed } from '../../utils';
import SwapOptionItem from '../SwapOptionItem';

const SwapOptionsContainer = () => {
  const { defaultStablecoin } = useUsdStablecoins();
  const dispatch = useAppDispatch();
  const nativeToken = useAppSelector((state) => state.tokens.tokens[INCH_NATIVE_TOKEN_ADDRESS]);
  const loadingQuote = useAppSelector((state) => state.swap.loadingQuote);
  const toToken = useAppSelector((state) => state.tokens.tokens[state.swap[Field.OUTPUT]]);
  const selectedMethod = useAppSelector((state) => state.swap.selectedMethod);
  const typedValue = useAppSelector((state) => state.swap.typedValue);
  const quoteInfo = useAppSelector((state) => state.swap.swapData);
  const gasPrice = useAppSelector((state) => state.swap.txFeeCalculation.gasPriceInfo.price);
  const fees = useAppSelector((state) => state.swap.txFees);

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
    return `${txCostInNativeToken.toFixed(4)} Ξ (~$${bigFloatToFixed(txCostInUsd.toString(), 4)})`;
  };

  const createSwapOptionItemLabels = (toTokenAmount?: string, toTokenDecimals?: number, txFee?: string) => {
    if (!Number(typedValue) || loadingQuote !== 'succeeded' || !gasPrice) return { txCost: '', quote: '' };

    return {
      txCost: createTxCostLabel(txFee),
      quote: createQuoteInfoLabel(toTokenAmount, toTokenDecimals),
    };
  };

  const oneInchItemLabels = createSwapOptionItemLabels(
    quoteInfo[ProtocolName.ONE_INCH]?.toTokenAmount,
    toToken?.decimals,
    fees[ProtocolName.ONE_INCH] || ''
  );

  const uniswapLabels = createSwapOptionItemLabels(
    quoteInfo[ProtocolName.UNISWAP_V3]?.toTokenAmount,
    toToken?.decimals,
    fees[ProtocolName.UNISWAP_V3]
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
