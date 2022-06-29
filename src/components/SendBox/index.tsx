import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { Box, Link, Skeleton, Typography } from '@mui/material';
import React, { useMemo } from 'react';

import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import { useAppSelector } from '../../store/hooks';
import { ApproveStatus } from '../../store/state/approve/approveSlice';
import { Field } from '../../store/state/swap/swapSlice';
import SelectTokenButton from '../Buttons/SelectTokenButton';
import InputAmount from '../InputAmount';

interface SendBoxProps {
  onSelectToken: () => void;
}

const SendBox = ({ onSelectToken }: SendBoxProps) => {
  const { account } = useActiveWeb3React();
  const { INPUT, status, typedValue, inputTokenPriceInUsd, loadingQuote, explorer } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap.INPUT],
    status: state.approve.approveAllowanceInfo.status,
    typedValue: state.swap.typedValue,
    inputTokenPriceInUsd: state.tokens.tokens[state.swap.INPUT]?.priceInUsd,
    loadingQuote: state.swap.loadingQuote,
    explorer: state.user.explorer,
  }));

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

  const userBalance = useMemo(() => {
    if (!INPUT) return '0';
    if (!Number(INPUT.userBalance)) return '0';
    return parseFloat(formatUnits(INPUT.userBalance || '0', INPUT.decimals)).toFixed(6);
  }, [INPUT]);

  const valueInUsd =
    inputTokenPriceInUsd && typedValue
      ? formatUnits(BigNumber.from(inputTokenPriceInUsd).mul(BigNumber.from(typedValue)), INPUT.decimals + 6)
      : '0';

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
        <Link
          target="_blank"
          sx={{
            typography: 'rxs12',
            color: 'dark.700',
          }}
          href={explorer && INPUT && `${explorer.link}/token/${INPUT.address}`}
          underline="hover">
          You sell
        </Link>
        {account && !Number(userBalance) ? (
          <Skeleton
            sx={{
              bgcolor: 'common.white',
            }}
            animation="wave"
            width="100px"
          />
        ) : (
          <Typography
            variant="rxs12"
            sx={{
              color: 'dark.700',
              lineHeight: '19px',
            }}>
            Balance: {userBalance}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          margin: '0 0 6px -9px',
        }}>
        <SelectTokenButton onClick={onSelectToken} field={Field.INPUT} />
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
        {inputTokenPriceInUsd && typedValue && loadingQuote === 'succeeded' ? (
          <Typography variant="rxs12" sx={{ color: 'dark.700', lineHeight: '19px' }}>
            ~$
            {parseFloat(valueInUsd).toFixed(2)}
          </Typography>
        ) : (
          <Skeleton
            sx={{
              bgcolor: 'common.white',
            }}
            animation="wave"
            width="100px"
          />
        )}
      </Box>
    </Box>
  );
};

export default SendBox;
