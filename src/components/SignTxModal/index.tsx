import { CircularProgress, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setIsWaitingTx, setTxErrorMessage } from '../../store/state/transactions/txSlice';
import MainButton, { MainButtonType } from '../Buttons/MainButton';
import TxFailedIcon from '../icons/TxFailedIcon';
import Modal, { ModalHeaderType } from '../Modal';

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
      <Stack
        sx={{
          m: '52px 0 110px',
        }}
        direction="column"
        justifyContent="space-between"
        alignItems="center">
        {txErrorMessage ? <TxFailedIcon /> : <StyledCircularProgress size={94} thickness={2} />}
        <Typography
          align="center"
          variant="rm16"
          sx={{
            mt: '52px',
            color: txErrorMessage ? 'red.500' : 'dark.900',
          }}>
          {txErrorMessage ? txErrorMessage : 'Please, sign transaction in your wallet'}
        </Typography>
      </Stack>
      <Stack>
        <MainButton type={MainButtonType.Close} onClick={closeModal} />
      </Stack>
    </Modal>
  );
};

export default SignTxModal;
