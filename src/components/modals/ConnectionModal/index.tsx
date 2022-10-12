import { Box, Button, ButtonProps, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';
import React, { useCallback, useEffect } from 'react';

import { connectionMethods } from '../../../constants';
import { Web3ConnectorType } from '../../../packages';
import { ConnectionMethod } from '../../../types';
import { Modal, ModalHeaderType } from '../Modal';

interface ConnectionModalProps {
  isOpen: boolean;
  goBack: () => void;
}

type Connector = {
  web3Connector: Web3ConnectorType;
  closeModal: () => void;
};

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
  const connect = ({ web3Connector, closeModal }: Connector) => {
    const [connector, hooks] = web3Connector;
    const isActive = hooks.useIsActive();

    useEffect(() => {
      if (isActive) closeModal();
    }, [isActive]);

    return useCallback(() => {
      connector.activate();
    }, [connector, isActive]);
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
          <StyledConnectionButton onClick={connect({ web3Connector: i.connector, closeModal: goBack })} key={i.name}>
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
