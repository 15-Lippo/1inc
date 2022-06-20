import { formatUnits } from '@ethersproject/units';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';

import { useAppSelector } from '../../store/hooks';
import { Field } from '../../store/state/swap/swapSlice';
import RouteArrow from '../icons/RouteArrow';
import { TooltipIcon } from '../icons/TooltipIcon';
import { LightTooltip } from '../LightTooltip';

const RateSection = () => {
  const { account } = useWeb3React();
  const { INPUT, OUTPUT, inputAmount, outputAmount, loadingQuote } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap[Field.INPUT]] || {},
    OUTPUT: state.tokens.tokens[state.swap[Field.OUTPUT]] || {},
    inputAmount: state.swap.typedValue || '0',
    outputAmount: state.swap.quoteInfo?.toTokenAmount || '0',
    loadingQuote: state.swap.loadingQuote,
  }));
  const [outputPrice, setOutputPrice] = useState<string>('0');
  const [inputPrice, setInputPrice] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (Number(outputAmount) && Number(inputAmount)) {
      // @ts-ignore
      const output = inputAmount / outputAmount;
      // @ts-ignore
      const input = outputAmount / inputAmount;
      setInputPrice(input.toFixed(4));
      setOutputPrice(output.toFixed(4));
    }
  }, [INPUT?.address, OUTPUT?.address, account, loadingQuote]);

  useEffect(() => {
    account && outputPrice !== '0' && loadingQuote === 'succeeded'
      ? setLoading(false)
      : setLoading(true);
  }, [account, outputPrice]);

  const inputInUsd = INPUT?.priceInUsd
    ? parseFloat(formatUnits(INPUT?.priceInUsd, 6)).toFixed(2)
    : '0';

  const outputInUsd = OUTPUT?.priceInUsd
    ? parseFloat(formatUnits(OUTPUT?.priceInUsd, 6)).toFixed(2)
    : '0';

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="stretch"
      spacing={1}
      sx={{
        color: 'dark.700',
        mb: '8px',
      }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
        <Typography variant="rxs12">Rate</Typography>
        {loading ? (
          <Skeleton
            sx={{
              bgcolor: 'cool.100',
            }}
            animation="wave"
            width="151px"
          />
        ) : (
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Typography
              variant="rxs12"
              sx={{
                lineHeight: '19px',
              }}>{`1 ${OUTPUT.symbol} = ${outputPrice} ${INPUT.symbol} ${
              OUTPUT?.priceInUsd && `(~$${outputInUsd})`
            }`}</Typography>
            <LightTooltip
              leaveDelay={200}
              arrow
              placement="left"
              sx={{
                cursor: 'pointer',
              }}
              title={
                <Stack direction="column" spacing={1} sx={{ padding: '5px' }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}>
                    <Typography variant="rxs12">{`${INPUT.symbol} price`}</Typography>
                    {INPUT?.priceInUsd && (
                      <Typography
                        variant="rxs12"
                        sx={{
                          color: 'dark.700',
                        }}>
                        ~${inputInUsd}
                      </Typography>
                    )}
                    <Typography variant="rxs12">{`${inputPrice} ${
                      INPUT.symbol === 'ETH' ? 'Ξ' : INPUT.symbol
                    }`}</Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}>
                    <Typography variant="rxs12">{`${OUTPUT.symbol} price`}</Typography>
                    {OUTPUT?.priceInUsd && (
                      <Typography
                        variant="rxs12"
                        sx={{
                          color: 'dark.700',
                        }}>
                        ~${outputInUsd}
                      </Typography>
                    )}
                    <Typography variant="rxs12">{` ${outputPrice}  ${
                      OUTPUT.symbol === 'ETH' ? 'Ξ' : OUTPUT.symbol
                    }`}</Typography>
                  </Stack>
                </Stack>
              }>
              {TooltipIcon}
            </LightTooltip>
          </Stack>
        )}
      </Stack>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
        <Typography variant="rxs12">Route</Typography>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
          <Typography variant="rxs12">{INPUT.symbol}</Typography>
          <RouteArrow />
          <Typography variant="rxs12">{OUTPUT.symbol}</Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

export default RateSection;
