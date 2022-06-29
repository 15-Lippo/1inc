import { Box, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setIsWaitingTx, setTxErrorMessage } from '../../store/state/transactions/txSlice';
import MainButton, { MainButtonType } from '../Buttons/MainButton';
import TxFailedIcon from '../icons/TxFailedIcon';
import { Modal, ModalHeaderType } from '../Modal';

const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  color: theme.palette.blue[500],
}));

const SignTxModal = () => {
  const dispatch = useAppDispatch();
  const { isWaitingTx, txErrorMessage } = useAppSelector((state) => state.transactions);

  const closeModal = () => {
    dispatch(setTxErrorMessage(''));
    dispatch(setIsWaitingTx(false));
  };

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
        {txErrorMessage ? <TxFailedIcon /> : <StyledCircularProgress size={94} thickness={2} />}
      </Box>
      <Typography
        align="center"
        variant="rm16"
        sx={{
          color: txErrorMessage ? 'red.500' : 'dark.900',
        }}>
        {txErrorMessage ? txErrorMessage : 'Please, sign transaction in your wallet'}
      </Typography>
      <MainButton type={MainButtonType.Close} onClick={closeModal} />
    </Modal>
  );
};

export default SignTxModal;
