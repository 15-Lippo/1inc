import { Button } from '@mui/material';
import React from 'react';

interface AddTokenProps {
  walletIsConnected: boolean;
  onClick: () => void;
}
const AddToken = ({ onClick, walletIsConnected }: AddTokenProps) => {
  return (
    <Button
      disabled={!walletIsConnected}
      sx={{
        '&:disabled': {
          color: 'dark.500',
        },
        typography: walletIsConnected ? 'rm16' : 'rxs12',
        fontWeight: '500',
        textTransform: 'none',
        p: '10px 0 0 0',
        bgcolor: 'transparent',
        color: 'blue.500',
        ':hover': {
          bgcolor: 'transparent',
          color: 'blue.500',
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
