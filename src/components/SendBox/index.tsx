import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { Box, Link, Skeleton, Typography } from '@mui/material';
import React, { useMemo } from 'react';

import { Tokens } from '../../constants';
import { useActiveWeb3React } from '../../packages/web3-provider';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { ApproveStatus } from '../../store/state/approve/approveSlice';
import { typeInput } from '../../store/state/swap/swapSlice';
import { Field } from '../../types';
import { AuxButton } from '../buttons';
import SelectTokenButton from '../buttons/SelectTokenButton';
import { InputAmount } from '../fields';
import { LockerIcon } from '../icons';

interface SendBoxProps {
  onSelectToken: () => void;
}

const SendBox = ({ onSelectToken }: SendBoxProps) => {
  const dispatch = useAppDispatch();
  const { account } = useActiveWeb3React();
  const { INPUT, status, typedValue, inputTokenPriceInUsd, loadingQuote, explorer, txFee } = useAppSelector(
    (state) => ({
      INPUT: state.tokens.tokens[state.swap.INPUT],
      status: state.approve.approveAllowanceInfo.status,
      typedValue: state.swap.typedValue,
      inputTokenPriceInUsd: state.tokens.tokens[state.swap.INPUT]?.priceInUsd,
      loadingQuote: state.swap.loadingQuote,
      explorer: state.user.explorer,
      txFee: state.swap.txFeeCalculation.txFee,
    })
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

  const onMaxClick = () => {
    const bal = INPUT.userBalance;
    if (!Number(bal) || !Number(txFee)) {
      return;
    }
    let maxAmount = BigNumber.from(bal);
    if (INPUT.address === Tokens.NATIVE_TOKEN_ADDRESS) {
      maxAmount = maxAmount.sub(txFee as string); // txFee is validated 3 lines above
    }
    dispatch(
      typeInput({
        field: Field.INPUT,
        typedValue: maxAmount.toString(),
      })
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        bgcolor: 'widget.bg-01',
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
            color: 'widget.text-secondary',
          }}
          href={explorer && INPUT && `${explorer.link}/token/${INPUT.address}`}
          underline="hover">
          You sell
        </Link>
        {account && !Number(userBalance) ? (
          <Skeleton
            sx={{
              bgcolor: 'widget.skeleton-01',
            }}
            animation="wave"
            width="100px"
          />
        ) : (
          <Box sx={{ display: 'flex', columnGap: '4px' }}>
            <Typography
              variant="rxs12"
              sx={{
                color: 'widget.text-secondary',
                lineHeight: '19px',
              }}>
              Balance: {userBalance}
            </Typography>
            <AuxButton onClick={onMaxClick} text="Max" sx={{ lineHeight: '19px' }} />
          </Box>
        )}
      </Box>

      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          margin: '0 0 6px -9px',
        }}>
        <SelectTokenButton onClick={onSelectToken} field={Field.INPUT} />
        <Box>{status === ApproveStatus.APPROVAL_NEEDED && <LockerIcon />}</Box>
        <InputAmount inputId={Field.INPUT} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
        <Typography variant="rxs12" sx={{ color: 'widget.text-secondary' }}>
          {INPUT?.name}
        </Typography>
        {inputTokenPriceInUsd && typedValue && loadingQuote === 'succeeded' ? (
          <Typography variant="rxs12" sx={{ color: 'widget.text-secondary', lineHeight: '19px' }}>
            ~$
            {parseFloat(valueInUsd).toFixed(2)}
          </Typography>
        ) : (
          <Skeleton
            sx={{
              bgcolor: 'widget.skeleton-01',
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
