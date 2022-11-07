import { formatUnits } from '@ethersproject/units';
import { Box, Link, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import _ from 'lodash';
import React, { useMemo } from 'react';
import { Trans } from 'react-i18next';

import { useAppSelector } from '../../store';
import { Field } from '../../types';
import { bigFloatToFixed } from '../../utils';
import { SelectTokenButton } from '../buttons';
import SkeletonText from '../SkeletonText';
import SwapOptionsContainer from '../SwapOptionsContainer';

interface GetBoxProps {
  onSelectToken: () => void;
}

const GetBox = ({ onSelectToken }: GetBoxProps) => {
  const { account } = useWeb3React();
  const OUTPUT = useAppSelector((state) => state.tokens.tokens[state.swap.OUTPUT]);
  const explorer = useAppSelector((state) => state.user.explorer);

  const tokenOutBalance = useMemo(() => {
    if (_.isEmpty(OUTPUT)) return;
    if (account && !OUTPUT?.userBalance) return;
    if (!Number(OUTPUT?.userBalance)) return '0';
    return bigFloatToFixed(formatUnits(OUTPUT.userBalance || '0', OUTPUT.decimals), 6);
  }, [account, OUTPUT?.address, OUTPUT?.userBalance]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '15px 15px 8px',
        margin: '13px 0',
        border: '1px solid',
        borderColor: 'widget.border-00',
        borderRadius: '16px',
      }}>
      <Box
        sx={{
          justifyContent: 'space-between',
          display: 'flex',
          alignItems: 'center',
          height: '19px',
        }}>
        <Link
          target="_blank"
          sx={{
            typography: 'rxs12',
            color: 'widget.text-secondary',
          }}
          href={explorer && `${explorer.link}/token/${OUTPUT}`}
          underline="hover">
          <Trans>You buy</Trans>
        </Link>
        {account &&
          (tokenOutBalance ? (
            <Box sx={{ display: 'flex', columnGap: '4px' }}>
              <Typography
                variant="rxs12"
                sx={{
                  color: 'widget.text-secondary',
                  lineHeight: '19px',
                }}>
                <Trans>Balance</Trans>: {tokenOutBalance}
              </Typography>
            </Box>
          ) : (
            <SkeletonText height="19px" bgcolor="widget.skeleton-01" />
          ))}
      </Box>

      <Box
        sx={{
          margin: '10px 0 16px -9px',
        }}>
        <SelectTokenButton onClick={onSelectToken} field={Field.OUTPUT} />
      </Box>

      <SwapOptionsContainer />
    </Box>
  );
};

export default GetBox;
