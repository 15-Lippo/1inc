import { formatUnits } from '@ethersproject/units';
import { Box, Skeleton, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import React, { useState } from 'react';

import { useAppSelector } from '../../store/hooks';
import { Field } from '../../store/state/swap/swapSlice';
import SelectTokenButton from '../Buttons/SelectTokenButton';
import SelectTokenModal from '../SelectTokenModal';

const GetBox = () => {
  const { account } = useWeb3React();
  const { quoteInfo, typedValue, loadingQuote } = useAppSelector((state) => state.swap);
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
          margin: '10px 0 24px -6px',
        }}>
        <SelectTokenButton onClick={() => setSelectTokenModal(true)} field={Field.OUTPUT} />
      </Box>

      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid',
          borderColor: 'blue.500',
          borderRadius: '8px 12px 12px 12px',
          padding: '17px',
          color: 'dark.900',
        }}>
        <Box
          sx={{
            position: 'absolute',
            top: -11,
            left: -1,
            display: 'flex',
            alignItems: 'center',
            borderRadius: '10px 10px 10px 0px',
            padding: '2px 7px 3px',
            backgroundColor: 'green.500',
          }}>
          <Typography
            variant="rxs12"
            sx={{
              color: 'common.white',
            }}>
            Best quote
          </Typography>
        </Box>
        <Typography variant="rm16">1inch</Typography>
        {quoteInfo &&
        quoteInfo.toTokenAmount &&
        account &&
        typedValue &&
        loadingQuote === 'succeeded' ? (
          <Typography variant="mlg18">
            {formatUnits(quoteInfo?.toTokenAmount, quoteInfo.toToken?.decimals)}
          </Typography>
        ) : (
          <Skeleton
            sx={{
              bgcolor: 'cool.100',
            }}
            animation="wave"
            height={24}
            width="151px"
          />
        )}
      </Box>

      <SelectTokenModal
        field={Field.OUTPUT}
        onClose={onCloseListModal}
        isOpen={isOpenSelectTokenModal}
      />
    </Box>
  );
};

export default GetBox;
