import { Box, Button, ButtonProps, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';
import { useWeb3React } from '@web3-react/core';
import { Connector } from '@web3-react/types';
import React, { useCallback } from 'react';

import useConnectors from '../../../hooks/web3/useConnectors';
import { ConnectionMethod, SupportedWallets } from '../../../types';
import { MetamaskIcon, WalletConnectIcon } from '../../icons';
import { Modal, ModalHeaderType } from '../Modal';

interface ConnectionModalProps {
  isOpen: boolean;
  goBack: () => void;
}

const StyledConnectionButton: StyledComponent<any> = styled(Button)<ButtonProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  columnGap: '20px',
  transition: 'none',
  border: `1px solid ${theme.palette.widget['input-bg']}`,
  borderRadius: '12px',
  padding: '15px 22px',
  backgroundColor: theme.palette.widget['input-bg'],
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.widget['input-bg'],
    border: `1px solid ${theme.palette.widget['input-border']}`,
  },
}));

const ConnectionModal = ({ isOpen, goBack }: ConnectionModalProps) => {
  const connectors = useConnectors();
  const { isActive } = useWeb3React();

  const onActivate = useCallback(
    async (connector: Connector, closeModal: () => void) => {
      try {
        await connector.activate();
      } catch (err) {
        console.error(err);
      }
      if (isActive) closeModal();
    },
    [isActive]
  );

  const connectionMethods: Record<string, ConnectionMethod> = {
    [SupportedWallets.Metamask]: {
      name: 'Metamask',
      connector: connectors?.metaMask,
      logo: MetamaskIcon,
    },
    [SupportedWallets.WalletConnect]: {
      name: 'Wallet Connect',
      connector: connectors?.walletConnect,
      logo: WalletConnectIcon,
    },
  };

  return (
    <Modal headerType={ModalHeaderType.Connection} goBack={goBack} isOpen={isOpen}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: '10px',
          height: '100%',
        }}>
        {Object.values(connectionMethods).map((i: ConnectionMethod) => (
          <StyledConnectionButton onClick={() => onActivate(i.connector, goBack)} key={i.name}>
            {i?.logo()}
            <Typography variant="rm16" lineHeight="19px" color="widget.text-primary">
              {i.name}
            </Typography>
          </StyledConnectionButton>
        ))}
      </Box>
    </Modal>
  );
};

export default ConnectionModal;
