import { Box, Paper, Typography } from '@mui/material';

export interface Props {
  slippagePercent: number;
}

const SlippageWarningMsg = ({ slippagePercent }: Props) => {
  return slippagePercent > 5 ? (
    <Paper
      elevation={0}
      sx={{
        m: '14px 0 0',
        backgroundColor: 'yellow.20',
        display: 'flex',
        borderRadius: '12px',
        padding: '13px',
        bgcolor: slippagePercent >= 15 ? 'red.16' : 'yellow.20',
      }}>
      <Box
        sx={{
          padding: '2px 20px 4px 10px',
          '& svg #warning-icon-bg': {
            fill: slippagePercent >= 15 ? '#E3402A' : '#FF9C08',
          },
        }}>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            id="warning-icon-bg"
            d="M6 0C2.69 0 0 2.69 0 6C0 9.31 2.69 12 6 12C9.31 12 12 9.31 12 6C12 2.69 9.31 0 6 0Z"
          />
          <path
            d="M6.00013 2.84998C5.50013 2.84998 5.25049 3.25848 5.25049 3.53848V3.78083L5.50013 6.74998C5.50013 7.02998 5.72013 7.24998 6.00013 7.24998C6.28013 7.24998 6.50013 7.02998 6.50013 6.74998L6.69598 3.78083V3.5C6.69591 3.21095 6.37966 2.84998 6.00013 2.84998Z"
            fill="white"
          />
          <path
            d="M6.01 8.85102C5.75 8.83102 5.51 9.10102 5.5 9.37102C5.5 9.38102 5.5 9.44102 5.5 9.45102C5.5 9.72102 5.71 9.92102 5.99 9.93102H6C6.27 9.93102 6.49 9.69102 6.5 9.43102C6.5 9.42102 6.5 9.32102 6.5 9.32102C6.5 9.03102 6.29 8.85102 6.01 8.85102Z"
            fill="white"
          />
        </svg>
      </Box>

      <Typography
        variant="rxs12"
        sx={{
          lineHeight: '20px',
        }}>
        You may receive {slippagePercent}% less with this level of slippage tolerance
      </Typography>
    </Paper>
  ) : null;
};

export default SlippageWarningMsg;
