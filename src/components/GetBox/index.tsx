import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';

import { useAppSelector } from '../../store/hooks';
import { Field } from '../../store/state/swap/swapSlice';
import SelectTokenButton from '../Buttons/SelectTokenButton';
import SelectTokenModal from '../SelectTokenModal';

const useStyles = makeStyles(() => ({
  getBoxRoot: {
    display: 'flex',
    flexDirection: 'column',
  },
  getTitle: {},
  getAction: {},
}));

const GetBox = () => {
  const classes = useStyles();
  const { OUTPUT } = useAppSelector((state) => state.swap);
  const quoteState = useAppSelector((state) => state.swap.quoteInfo);
  const [isOpenSelectTokenModal, setSelectTokenModal] = useState<boolean>(false);

  const onCloseListModal = () => {
    setSelectTokenModal(false);
  };

  return (
    <Box className={classes.getBoxRoot}>
      <Typography className={classes.getTitle}>Get</Typography>
      <div>
        <SelectTokenButton
          token={OUTPUT.currency}
          onClick={() => setSelectTokenModal(true)}
          field={Field.OUTPUT}
        />
        <Typography>Quote: {quoteState?.toTokenAmount}</Typography>
      </div>

      <SelectTokenModal
        field={Field.OUTPUT}
        closeModal={onCloseListModal}
        isOpen={isOpenSelectTokenModal}
      />
    </Box>
  );
};

export default GetBox;
