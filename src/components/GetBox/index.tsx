import { formatUnits } from '@ethersproject/units';
import { Box, Link, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Trans } from 'react-i18next';

import { Tokens } from '../../constants';
import { useActiveWeb3React } from '../../packages/web3-provider';
import { useAppSelector } from '../../store/hooks';
import { useCalculateTxCost } from '../../store/state/swap/useCalculateTxCost';
import { Field } from '../../types';
import { SelectTokenButton } from '../buttons';
import SkeletonText from '../SkeletonText';

interface GetBoxProps {
  onSelectToken: () => void;
}

const GetBox = ({ onSelectToken }: GetBoxProps) => {
  const { chainId } = useActiveWeb3React();
  const { estimateGasLimit } = useCalculateTxCost();
  const { quoteInfo, loadingQuote, swapInfo, txFeeCalculation } = useAppSelector((state) => state.swap);
  const { typedValue, OUTPUT } = useAppSelector((state) => state.swap);
  const tokens = useAppSelector((state) => state.tokens.tokens);
  const explorer = useAppSelector((state) => state.user.explorer);

  useEffect(() => {
    if (swapInfo && swapInfo?.tx?.data) estimateGasLimit();
  }, [swapInfo?.tx?.data]);

  const txCostInTokenInput =
    txFeeCalculation?.txFee && parseFloat(formatUnits(txFeeCalculation?.txFee, 'ether')).toFixed(4);

  const usdcToken = chainId && tokens[Tokens.DOLLAR_TIED_TOKENS[chainId][0]];

  const txCostInUsdPerNativeToken =
    usdcToken &&
    tokens[Tokens.NATIVE_TOKEN_ADDRESS]?.priceInUsd &&
    parseFloat(formatUnits(tokens[Tokens.NATIVE_TOKEN_ADDRESS]?.priceInUsd as string, usdcToken.decimals)).toFixed(2);

  const txCostInUsd = Number(txCostInTokenInput) * Number(txCostInUsdPerNativeToken);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '15px 15px 8px',
        margin: '13px 0',
        border: '1px solid',
        borderColor: 'widget.border-00',
        borderRadius: '16px',
      }}>
      <Link
        target="_blank"
        sx={{
          typography: 'rxs12',
          color: 'widget.text-secondary',
        }}
        href={explorer && `${explorer.link}/token/${OUTPUT}`}
        underline="hover">
        <Trans>You buy</Trans>
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
          borderColor: 'widget.border-02',
          borderRadius: '8px 12px 12px 12px',
          padding: '17px 12px 12px',
          color: 'widget.text-primary',
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
            backgroundColor: 'widget.bg-07',
          }}>
          <Typography variant="rxs12" color="widget.text-primary-02">
            <Trans>Best quote</Trans>
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
          <Typography variant="rm16">1inch</Typography>
          {quoteInfo && quoteInfo.toTokenAmount && typedValue && loadingQuote === 'succeeded' ? (
            <Typography variant="mlg18" lineHeight="24px">
              {parseFloat(formatUnits(quoteInfo?.toTokenAmount, quoteInfo.toToken?.decimals)).toFixed(6)}
            </Typography>
          ) : (
            <SkeletonText width="151px" height="24px" />
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
          {txCostInTokenInput && txCostInUsd && typedValue && loadingQuote === 'succeeded' ? (
            <Typography variant="rxs12" lineHeight="24px" color="widget.text-secondary">
              <Trans>Tx cost</Trans>
              {` ${txCostInTokenInput} Ξ (~$${txCostInUsd.toFixed(2)})`}
            </Typography>
          ) : (
            <SkeletonText width="151px" height="24px" />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default GetBox;
