import { Box, Stack, Typography } from '@mui/material';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { useRate } from '../../hooks';
import { useAppSelector, useUsdStablecoins } from '../../store';
import { Field } from '../../types';
import { formatUsdFixed } from '../../utils';
import { RouteButton } from '../buttons';
import { TooltipIcon } from '../icons';
import { LightTooltip } from '../LightTooltip';
import SkeletonText from '../SkeletonText';

interface RateSectionProps {
  openRoute: () => void;
  totalRouteSteps: number;
}
const RateSection = ({ openRoute, totalRouteSteps }: RateSectionProps) => {
  const { t } = useTranslation();
  const { INPUT, OUTPUT, inputAmount, outputAmount, loadingQuote, protocols, tokens } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap[Field.INPUT]] || {},
    OUTPUT: state.tokens.tokens[state.swap[Field.OUTPUT]] || {},
    inputAmount: state.swap.typedValue || '0',
    outputAmount: state.swap.swapData[state.swap.selectedMethod]?.toTokenAmount || '0',
    loadingQuote: state.swap.loadingQuote,
    protocols: state.swap.swapData[state.swap.selectedMethod]?.route,
    tokens: state.tokens.tokens,
  }));
  const inputUsdPrice = useAppSelector((state) => state.tokens.usdPrices[INPUT?.address]);
  const outputUsdPrice = useAppSelector((state) => state.tokens.usdPrices[OUTPUT?.address]);

  const [loading, setLoading] = useState<boolean>(true);
  const { defaultStablecoin } = useUsdStablecoins();

  const price = useRate(inputAmount.toString(), outputAmount.toString());

  useEffect(() => {
    price.output !== '0' && loadingQuote === 'succeeded' ? setLoading(false) : setLoading(true);
  }, [price, loadingQuote]);

  const inputUsdPriceToDisplay =
    inputUsdPrice && defaultStablecoin && formatUsdFixed(inputUsdPrice, defaultStablecoin.decimals);
  const outputUsdPriceToDisplay =
    outputUsdPrice && defaultStablecoin && formatUsdFixed(outputUsdPrice, defaultStablecoin.decimals);

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="stretch"
      spacing={1}
      sx={{
        color: 'widget.text-secondary',
        mb: '8px',
      }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" lineHeight="19px" spacing={1}>
        <Typography variant="rxs12">
          <Trans>Rate</Trans>
        </Typography>
        {loading || !outputUsdPriceToDisplay ? (
          <SkeletonText width="151px" height="19px" />
        ) : (
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Typography variant="rxs12">
              {`1 ${OUTPUT.symbol} = ${price.output} ${INPUT.symbol} (~$${outputUsdPriceToDisplay})`}
            </Typography>
            <LightTooltip
              leaveDelay={200}
              arrow
              placement="left"
              sx={{
                cursor: 'pointer',
              }}
              title={
                <Stack direction="column" spacing={1} sx={{ padding: '5px' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Typography variant="rxs12">{`${INPUT.symbol} ` + t('price')}</Typography>
                    {inputUsdPriceToDisplay && <Typography variant="rxs12">~${inputUsdPriceToDisplay}</Typography>}
                    <Typography variant="rxs12">{`${price.input} ${
                      INPUT.symbol === 'ETH' ? 'Ξ' : INPUT.symbol
                    }`}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Typography variant="rxs12">{`${OUTPUT.symbol} ` + t('price')}</Typography>
                    {outputUsdPriceToDisplay && <Typography variant="rxs12">~${outputUsdPriceToDisplay}</Typography>}
                    <Typography variant="rxs12">{` ${price.output}  ${
                      OUTPUT.symbol === 'ETH' ? 'Ξ' : OUTPUT.symbol
                    }`}</Typography>
                  </Stack>
                </Stack>
              }>
              <TooltipIcon />
            </LightTooltip>
          </Stack>
        )}
      </Stack>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignContent: 'center',
          lineHeight: '19px',
        }}>
        <Typography variant="rxs12">
          <Trans>Route</Trans>
        </Typography>
        {!protocols?.length ||
        _.isEmpty(tokens) ||
        !totalRouteSteps ||
        !INPUT.symbol ||
        loadingQuote !== 'succeeded' ? (
          <SkeletonText width="80px" height="19px" />
        ) : (
          <RouteButton
            tokens={tokens}
            inputTokenSymbol={INPUT.symbol}
            protocols={protocols}
            onClick={openRoute}
            totalRouteSteps={totalRouteSteps}
          />
        )}
      </Box>
    </Stack>
  );
};

export default RateSection;
