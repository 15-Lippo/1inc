import { formatUnits } from '@ethersproject/units';
import { Box, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import React, { useMemo, useState } from 'react';

import { useAppSelector } from '../../store/hooks';
import { ApproveStatus } from '../../store/state/approve/approveSlice';
import { Field } from '../../store/state/swap/swapSlice';
import SelectTokenButton from '../Buttons/SelectTokenButton';
import InputAmount from '../InputAmount';
import SelectTokenModal from '../SelectTokenModal';

const SendBox = () => {
  const { account } = useWeb3React();
  const { INPUT, status, typedValue } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap.INPUT],
    status: state.approve.approveAllowanceInfo.status,
    typedValue: state.swap.typedValue,
  }));
  const [isOpenSelectTokenModal, setSelectTokenModal] = useState<boolean>(false);

  const LockIcon = (
    <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.81816 6.875H2.18179C1.5793 6.875 1.09088 7.43464 1.09088 8.125V12.5C1.09088 13.1904 1.5793 13.75 2.18179 13.75H9.81816C10.4206 13.75 10.9091 13.1904 10.9091 12.5V8.125C10.9091 7.43464 10.4206 6.875 9.81816 6.875Z"
        stroke="#FF9C08"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.27271 6.875V4.375C3.27271 3.5462 3.56004 2.75134 4.0715 2.16529C4.58297 1.57924 5.27666 1.25 5.99998 1.25C6.7233 1.25 7.41699 1.57924 7.92845 2.16529C8.43991 2.75134 8.72725 3.5462 8.72725 4.375V6.875"
        stroke="#FF9C08"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

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
        padding: '15px',
        borderRadius: '16px',
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
          alignItems: 'center',
          display: 'flex',
          margin: '6px 0 6px -6px',
        }}>
        <SelectTokenButton
          // token={INPUT}
          onClick={() => setSelectTokenModal(true)}
          field={Field.INPUT}
        />
        <Box>{status === ApproveStatus.APPROVAL_NEEDED && LockIcon}</Box>
        <InputAmount inputId={Field.INPUT} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
        <Typography variant="rxs12" sx={{ color: 'dark.700' }}>
          {INPUT?.name}
        </Typography>
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
