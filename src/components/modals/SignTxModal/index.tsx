import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setIsWaitingTx, setTxErrorMessage } from '../../../store/state/transactions/txSlice';
import { MainButton, MainButtonType } from '../../buttons';
import { TxFailedIcon } from '../../icons';
import { Modal, ModalHeaderType } from '../Modal';

const SignTxModal = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isWaitingTx, txErrorMessage } = useAppSelector((state) => state.transactions);

  const closeModal = () => {
    dispatch(setTxErrorMessage(''));
    dispatch(setIsWaitingTx(false));
  };

  const message = txErrorMessage ? txErrorMessage : t('Please, sign transaction in your wallet');
  return (
    <Modal
      headerType={txErrorMessage ? ModalHeaderType.Failed : ModalHeaderType.Sign}
      isOpen={isWaitingTx}
      closeModal={closeModal}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}>
        {txErrorMessage ? (
          <TxFailedIcon />
        ) : (
          <CircularProgress sx={{ color: 'widget.icon-10' }} size={94} thickness={2} />
        )}
      </Box>
      <Typography
        align="center"
        variant="rm16"
        sx={{
          color: 'widget.text-primary',
        }}>
        {message}
      </Typography>
      <MainButton type={MainButtonType.Close} onClick={closeModal} />
    </Modal>
  );
};

export default SignTxModal;
