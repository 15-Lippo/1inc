import { Paper, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface RefreshRateWarningMsgProps {
  inputTokenSymbol: string;
  outputTokenSymbol: string;
  quoteUpdated: boolean;
}

const RefreshRateWarningMsg = ({ inputTokenSymbol, outputTokenSymbol, quoteUpdated }: RefreshRateWarningMsgProps) => {
  const { t } = useTranslation();
  const message = quoteUpdated
    ? t('exchange rate has expired', { inputTokenSymbol, outputTokenSymbol })
    : t('We managed to get a better rate!', { inputTokenSymbol, outputTokenSymbol });
  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        borderRadius: '12px',
        padding: '8px 14px',
        backgroundColor: quoteUpdated ? 'widget.bg-alert-error' : 'widget.bg-alert',
      }}>
      <Typography
        variant="rsm14"
        sx={{
          color: 'widget.text-primary',
          lineHeight: '16px',
        }}>
        {message}
      </Typography>
    </Paper>
  );
};

export default RefreshRateWarningMsg;
