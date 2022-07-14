import { formatUnits } from '@ethersproject/units';
import { Box, Link, Skeleton, Typography } from '@mui/material';
import React, { useEffect } from 'react';

import { useAppSelector } from '../../store/hooks';
import { useCalculateTxCost } from '../../store/state/swap/useCalculateTxCost';
import { Field } from '../../types';
import SelectTokenButton from '../Buttons/SelectTokenButton';

interface GetBoxProps {
  onSelectToken: () => void;
}

const GetBox = ({ onSelectToken }: GetBoxProps) => {
  const { estimateGasLimit } = useCalculateTxCost();
  const { quoteInfo, typedValue, loadingQuote, swapInfo, txFeeCalculation, OUTPUT } = useAppSelector(
    (state) => state.swap
  );
  const tokens = useAppSelector((state) => state.tokens.tokens);
  const explorer = useAppSelector((state) => state.user.explorer);

  useEffect(() => {
    if (swapInfo && swapInfo?.tx?.data) estimateGasLimit();
  }, [swapInfo?.tx?.data]);

  const txCostInTokenInput =
    txFeeCalculation?.txFee && parseFloat(formatUnits(txFeeCalculation?.txFee, 'ether')).toFixed(4);

  const txCostInUsdPerNativeToken =
    tokens['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee']?.priceInUsd &&
    parseFloat(formatUnits(tokens['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee']?.priceInUsd, 6)).toFixed(2);

  const txCostInUsd = Number(txCostInTokenInput) * Number(txCostInUsdPerNativeToken);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '15px 15px 8px',
        margin: '13px 0',
        border: '1px solid',
        borderColor: 'cool.100',
        borderRadius: '16px',
      }}>
      <Link
        target="_blank"
        sx={{
          typography: 'rxs12',
          color: 'dark.700',
        }}
        href={explorer && `${explorer.link}/token/${OUTPUT}`}
        underline="hover">
        You buy
      </Link>

      <Box
        sx={{
          margin: '10px 0 24px -9px',
        }}>
        <SelectTokenButton onClick={onSelectToken} field={Field.OUTPUT} />
      </Box>

      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid',
          borderColor: 'blue.500',
          borderRadius: '8px 12px 12px 12px',
          padding: '17px 12px 12px',
          color: 'dark.900',
        }}>
        <Box
          sx={{
            position: 'absolute',
            top: -11,
            left: -1,
            display: 'flex',
            alignItems: 'center',
            borderRadius: '10px 10px 10px 0px',
            padding: '2px 7px 3px',
            backgroundColor: 'green.500',
          }}>
          <Typography
            variant="rxs12"
            sx={{
              color: 'common.white',
            }}>
            Best quote
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
          <Typography variant="rm16">1inch</Typography>
          {quoteInfo && quoteInfo.toTokenAmount && typedValue && loadingQuote === 'succeeded' ? (
            <Typography
              variant="mlg18"
              sx={{
                lineHeight: '24px',
              }}>
              {parseFloat(formatUnits(quoteInfo?.toTokenAmount, quoteInfo.toToken?.decimals)).toFixed(6)}
            </Typography>
          ) : (
            <Skeleton
              sx={{
                bgcolor: 'cool.100',
              }}
              animation="wave"
              height={24}
              width="151px"
            />
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
          {txCostInTokenInput && txCostInUsd && typedValue && loadingQuote === 'succeeded' ? (
            <Typography variant="rxs12" sx={{ color: 'dark.700', lineHeight: '24px' }}>
              {`Tx cost ${txCostInTokenInput} Ξ (~$${txCostInUsd.toFixed(2)})`}
            </Typography>
          ) : (
            <Skeleton
              sx={{
                bgcolor: 'cool.100',
              }}
              animation="wave"
              height={24}
              width="151px"
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default GetBox;
