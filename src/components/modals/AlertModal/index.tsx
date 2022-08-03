import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Trans } from 'react-i18next';

import { WarningIcon } from '../../icons';

interface AlertModalProps {
  text: string;
  title: string;
  open: boolean;
  onClose: () => void;
}

const modalStyle = {
  display: 'flex',
  position: 'absolute',
  width: 'inherit',
  height: 'inherit',
  top: '0',
  left: '0',
  justifyContent: 'center',
  alignItems: 'center',
  backdropFilter: 'blur(3px)',
  zIndex: 1300,
};

const wrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '320px',
  height: 'fit-content',
  boxShadow: '0px 12px 24px #E2E9F6',
  borderRadius: '24px',
  bgcolor: 'widget.bg-02',
  padding: '16px',
};

const textBoxStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  bgcolor: 'widget.bg-alert-warn',
  color: 'widget.text-warn',
  borderRadius: '16px',
  padding: '14px',
  margin: '14px 0 14px 0',
};

const closeButtonStyle = {
  color: 'text-main-btn-02',
  borderRadius: '12px',
  boxShadow: 'none',
  bgcolor: 'widget.bg-05',
  '&:hover': {
    boxShadow: 'none',
    bgcolor: 'widget.bg-05-hover',
  },
};

const AlertModal = ({ open, onClose, title, text }: AlertModalProps) => {
  return (
    <Box sx={{ ...modalStyle, display: open ? 'flex' : 'none' }}>
      <Box sx={wrapperStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Box sx={textBoxStyle}>
          <Box sx={{ padding: '3px' }}>
            <WarningIcon />
          </Box>
          <Box>
            <Typography variant="rsm14">{text}</Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Button sx={closeButtonStyle} variant="contained" onClick={onClose}>
            <Trans>Close</Trans>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AlertModal;
