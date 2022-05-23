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
      }}>
      <Typography
        variant="rxs12"
        sx={{
          color: 'dark.700',
        }}>
        You buy
      </Typography>

      <SelectTokenButton onClick={() => setSelectTokenModal(true)} field={Field.OUTPUT} />

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
