import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useWeb3React } from '@web3-react/core';
import React, { useState } from 'react';

import { useAppSelector } from '../../store/hooks';
import { Field } from '../../store/state/swap/swapSlice';
import { ITheme } from '../../theme';
import InputAmount from '../InputAmount';
import SelectTokenModal from '../SelectTokenModal';

const useStyles = makeStyles((theme: ITheme) => ({
  sendBoxRoot: {
    display: 'flex',
    backgroundColor: theme.palette.cool[100],
    flexDirection: 'column',
  },
  sendTitle: {
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'center',
  },
  sendAction: {
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
  },
}));

const SendBox = () => {
  const classes = useStyles();
  const { account } = useWeb3React();
  const { INPUT } = useAppSelector((state) => state.swap);
  const { status } = useAppSelector((state) => state.approve.approveAllowanceInfo);
  const [isOpenSelectTokenModal, setSelectTokenModal] = useState<boolean>(false);

  const onCloseListModal = () => {
    setSelectTokenModal(false);
  };

  return (
    <Box className={classes.sendBoxRoot}>
      <div className={classes.sendTitle}>
        <Typography>Send</Typography>
        {account && <p>Balance: {INPUT.currency.tokenAmount || 0}</p>}
      </div>

      <div className={classes.sendAction}>
        <Typography onClick={() => setSelectTokenModal(true)}>{INPUT.currency.symbol}</Typography>
        <Typography>{status}</Typography>
        <InputAmount inputId={Field.INPUT} />
      </div>

      <SelectTokenModal
        field={Field.INPUT}
        closeModal={onCloseListModal}
        isOpen={isOpenSelectTokenModal}
      />
    </Box>
  );
};

export default SendBox;
