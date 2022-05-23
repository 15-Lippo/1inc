import { formatUnits } from '@ethersproject/units';
import { Box, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import React, { useMemo, useState } from 'react';

import { useAppSelector } from '../../store/hooks';
import { Field } from '../../store/state/swap/swapSlice';
import SelectTokenButton from '../Buttons/SelectTokenButton';
import InputAmount from '../InputAmount';
import SelectTokenModal from '../SelectTokenModal';

const SendBox = () => {
  const { account } = useWeb3React();
  const { INPUT, status } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap.INPUT],
    status: state.approve.approveAllowanceInfo.status,
  }));
  const [isOpenSelectTokenModal, setSelectTokenModal] = useState<boolean>(false);

  const onCloseListModal = () => {
    setSelectTokenModal(false);
  };

  const userBalance = useMemo(() => {
    if (!INPUT) return '0';

    return formatUnits(INPUT.userBalance || '0', INPUT.decimals);
  }, [INPUT]);
  console.log(status);
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
            Balance: {userBalance}
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
          // token={INPUT}
          onClick={() => setSelectTokenModal(true)}
          field={Field.INPUT}
        />
        <Typography>{status}</Typography>
        <InputAmount inputId={Field.INPUT} />
      </Box>

      <SelectTokenModal
        field={Field.INPUT}
        onClose={onCloseListModal}
        isOpen={isOpenSelectTokenModal}
      />
    </Box>
  );
};

export default SendBox;
