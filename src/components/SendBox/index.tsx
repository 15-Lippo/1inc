import { Box, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import React, { useState } from 'react';

import { useAppSelector } from '../../store/hooks';
import { Field } from '../../store/state/swap/swapSlice';
import SelectTokenButton from '../Buttons/SelectTokenButton';
import InputAmount from '../InputAmount';
import SelectTokenModal from '../SelectTokenModal';

const SendBox = () => {
  const { account } = useWeb3React();
  const { INPUT } = useAppSelector((state) => state.swap);
  const { status } = useAppSelector((state) => state.approve.approveAllowanceInfo);
  const [isOpenSelectTokenModal, setSelectTokenModal] = useState<boolean>(false);

  const onCloseListModal = () => {
    setSelectTokenModal(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        bgcolor: 'cool.100',
        flexDirection: 'column',
      }}>
      <Box
        sx={{
          justifyContent: 'space-between',
          display: 'flex',
          alignItems: 'center',
        }}>
        <Typography
          variant="rxs12"
          sx={{
            color: 'dark.700',
          }}>
          You sell
        </Typography>
        {account && (
          <Typography
            variant="rxs12"
            sx={{
              color: 'dark.700',
            }}>
            Balance: {INPUT.currency.tokenAmount || 0}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          display: 'flex',
        }}>
        <SelectTokenButton
          token={INPUT.currency}
          onClick={() => setSelectTokenModal(true)}
          field={Field.INPUT}
        />
        <Typography>{status}</Typography>
        <InputAmount inputId={Field.INPUT} />
      </Box>

      <SelectTokenModal
        field={Field.INPUT}
        closeModal={onCloseListModal}
        isOpen={isOpenSelectTokenModal}
      />
    </Box>
  );
};

export default SendBox;
