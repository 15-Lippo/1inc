import { Button, useTheme } from '@mui/material';
import React from 'react';

interface AddTokenProps {
  walletIsConnected: boolean;
  onClick: () => void;
}
const AddToken = ({ onClick, walletIsConnected }: AddTokenProps) => {
  const theme = useTheme();
  return (
    <Button
      disabled={!walletIsConnected}
      sx={{
        '&:disabled': {
          color: theme.palette.widget['text-disabled'],
        },
        typography: walletIsConnected ? 'rm16' : 'rxs12',
        fontWeight: '500',
        textTransform: 'none',
        p: '10px 0 0 0',
        bgcolor: 'transparent',
        color: theme.palette.widget['text-primary-01'],
        ':hover': {
          bgcolor: 'transparent',
          color: theme.palette.widget['btn-text-hover'],
        },
      }}
      fullWidth
      disableElevation
      disableFocusRipple
      disableRipple
      onClick={onClick}>
      {walletIsConnected ? 'Add token +' : ' Connect wallet to add custom tokens'}
    </Button>
  );
};

export default AddToken;
