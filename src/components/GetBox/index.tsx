import { Box, Link } from '@mui/material';
import React, { useEffect } from 'react';
import { Trans } from 'react-i18next';

import { useAppSelector, useCalculateTxCost } from '../../store';
import { Field } from '../../types';
import { SelectTokenButton } from '../buttons';
import SwapOptionsContainer from '../SwapOptionsContainer';

interface GetBoxProps {
  onSelectToken: () => void;
}

const GetBox = ({ onSelectToken }: GetBoxProps) => {
  const { estimateGasLimit } = useCalculateTxCost();
  const swapInfo = useAppSelector((state) => state.swap.swapInfo);
  const OUTPUT = useAppSelector((state) => state.swap.OUTPUT);
  const explorer = useAppSelector((state) => state.user.explorer);

  useEffect(() => {
    if (swapInfo && swapInfo?.tx?.data) estimateGasLimit();
  }, [swapInfo?.tx?.data]);

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
          margin: '10px 0 16px -9px',
        }}>
        <SelectTokenButton onClick={onSelectToken} field={Field.OUTPUT} />
      </Box>

      <SwapOptionsContainer />
    </Box>
  );
};

export default GetBox;
