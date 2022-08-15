import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { Box, Link, Skeleton, Typography } from '@mui/material';
import _ from 'lodash';
import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Tokens } from '../../constants';
import { useActiveWeb3React } from '../../packages/web3-provider';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { ApproveStatus } from '../../store/state/approve/approveSlice';
import { typeInput } from '../../store/state/swap/swapSlice';
import { useUsdStablecoins } from '../../store/state/tokens/prices-in-usd/useUsdStablecoins';
import { Field } from '../../types';
import { AuxButton } from '../buttons';
import SelectTokenButton from '../buttons/SelectTokenButton';
import { InputAmount } from '../fields';
import { LockerIcon } from '../icons';

interface SendBoxProps {
  onSelectToken: () => void;
}

const SendBox = ({ onSelectToken }: SendBoxProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { account } = useActiveWeb3React();
  const { INPUT, status, typedValue, inputTokenPriceInUsd, loadingQuote, explorer, txFee, lastQuoteUpdateTimestamp } =
    useAppSelector((state) => ({
      INPUT: state.tokens.tokens[state.swap.INPUT],
      status: state.approve.approveAllowanceInfo.status,
      typedValue: state.swap.typedValue,
      inputTokenPriceInUsd: state.tokens.tokens[state.swap.INPUT]?.priceInUsd,
      loadingQuote: state.swap.loadingQuote,
      explorer: state.user.explorer,
      txFee: state.swap.txFeeCalculation.txFee,
      lastQuoteUpdateTimestamp: state.swap.lastQuoteUpdateTimestamp,
    }));
  const { defaultStablecoin } = useUsdStablecoins();

  const userBalance = useMemo(() => {
    if (_.isEmpty(INPUT)) return;
    if (account && !INPUT?.userBalance) return;
    if (!Number(INPUT?.userBalance)) return '0';
    return parseFloat(formatUnits(INPUT.userBalance || '0', INPUT.decimals)).toFixed(6);
  }, [account, INPUT?.address, INPUT?.userBalance]);

  const valueInUsd = useMemo(
    () =>
      inputTokenPriceInUsd && typedValue && !_.isEmpty(INPUT) && defaultStablecoin?.decimals
        ? parseFloat(
            formatUnits(
              BigNumber.from(typedValue).mul(BigNumber.from(inputTokenPriceInUsd)),
              INPUT.decimals + defaultStablecoin.decimals
            )
          ).toFixed(2)
        : '',
    [INPUT, inputTokenPriceInUsd, lastQuoteUpdateTimestamp]
  );

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
          <Trans>You sell</Trans>
        </Link>
        {account &&
          (userBalance ? (
            <Box sx={{ display: 'flex', columnGap: '4px' }}>
              <Typography
                variant="rxs12"
                sx={{
                  color: 'widget.text-secondary',
                  lineHeight: '19px',
                }}>
                <Trans>Balance</Trans>: {userBalance}
              </Typography>
              <AuxButton onClick={onMaxClick} text={t('Max')} sx={{ lineHeight: '19px' }} />
            </Box>
          ) : (
            <Skeleton
              sx={{
                bgcolor: 'widget.skeleton-01',
              }}
              animation="wave"
              width="100px"
            />
          ))}
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
        {valueInUsd && loadingQuote === 'succeeded' ? (
          <Typography variant="rxs12" sx={{ color: 'widget.text-secondary', lineHeight: '19px' }}>
            ~$
            {valueInUsd}
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
