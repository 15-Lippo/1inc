import { Box, Typography } from '@mui/material';
import React from 'react';
import { Trans } from 'react-i18next';

import SkeletonText from '../SkeletonText';

interface SwapOptionItemProps {
  optionName: string;
  quoteLabel: string;
  txCostLabel: string;
  isBestQuote?: boolean;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const SwapOptionItem = ({ quoteLabel, txCostLabel, onClick, optionName, isBestQuote }: SwapOptionItemProps) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: isBestQuote ? 'widget.border-02' : 'widget.border-03',
        borderRadius: '8px 12px 12px 12px',
        padding: '17px 12px 12px',
        color: 'widget.text-primary',
      }}>
      {isBestQuote && (
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
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}>
        <Typography variant="rm16">{optionName}</Typography>
        {quoteLabel ? (
          <Typography variant="mlg18" lineHeight="24px">
            {quoteLabel}
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
        {txCostLabel ? (
          <Typography variant="rxs12" lineHeight="24px" color="widget.text-secondary">
            <Trans>Tx cost</Trans>
            {': ' + txCostLabel}
          </Typography>
        ) : (
          <SkeletonText width="151px" height="24px" />
        )}
      </Box>
    </Box>
  );
};

export default SwapOptionItem;
