import { Paper, Typography } from '@mui/material';
import React from 'react';

interface RefreshRateWarningMsgProps {
  inputTokenSymbol: string;
  outputTokenSymbol: string;
  quoteUpdated: boolean;
}

const RefreshRateWarningMsg = ({ inputTokenSymbol, outputTokenSymbol, quoteUpdated }: RefreshRateWarningMsgProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        borderRadius: '12px',
        padding: '8px 14px',
        backgroundColor: quoteUpdated ? 'red.16' : 'blue.16',
      }}>
      <Typography
        variant="rsm14"
        sx={{
          color: 'dark.900',
          lineHeight: '16px',
        }}>
        {quoteUpdated
          ? `${inputTokenSymbol}/${outputTokenSymbol} exchange rate has expired.`
          : `We managed to get a better ${inputTokenSymbol}/${outputTokenSymbol} rate!`}
      </Typography>
    </Paper>
  );
};

export default RefreshRateWarningMsg;
