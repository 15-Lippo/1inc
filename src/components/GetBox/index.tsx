import { formatUnits } from '@ethersproject/units';
import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';

import { useAppSelector } from '../../store/hooks';
import { Field } from '../../store/state/swap/swapSlice';
import SelectTokenButton from '../Buttons/SelectTokenButton';
import SelectTokenModal from '../SelectTokenModal';

const GetBox = () => {
  const { quoteState } = useAppSelector((state) => {
    return {
      quoteState: state.swap.quoteInfo,
    };
  });
  const [isOpenSelectTokenModal, setSelectTokenModal] = useState<boolean>(false);

  const onCloseListModal = () => {
    setSelectTokenModal(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '15px',
        margin: '13px 0',
        border: '1px solid',
        borderColor: 'cool.100',
        borderRadius: '16px',
      }}>
      <Typography
        variant="rxs12"
        sx={{
          color: 'dark.700',
        }}>
        You buy
      </Typography>

      <Box
        sx={{
          margin: '10px 0 14px -6px',
        }}>
        <SelectTokenButton onClick={() => setSelectTokenModal(true)} field={Field.OUTPUT} />
      </Box>

      <Typography variant="mlg18">
        1inch{' '}
        {quoteState &&
          quoteState.toTokenAmount &&
          parseFloat(formatUnits(quoteState?.toTokenAmount))}
      </Typography>

      <SelectTokenModal
        field={Field.OUTPUT}
        onClose={onCloseListModal}
        isOpen={isOpenSelectTokenModal}
      />
    </Box>
  );
};

export default GetBox;
