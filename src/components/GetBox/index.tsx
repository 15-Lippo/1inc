import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';

import { useAppSelector } from '../../store/hooks';

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

  return (
    <Box className={classes.getBoxRoot}>
      <Typography className={classes.getTitle}>Get</Typography>
      <div>
        <Typography>{OUTPUT.currency.symbol}</Typography>
        <Typography>Quote: {quoteState?.toTokenAmount}</Typography>
      </div>
    </Box>
  );
};

export default GetBox;
