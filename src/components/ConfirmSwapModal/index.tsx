import { TransactionRequest } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import { Box, Stack, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import React, { useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSwap, Field } from '../../store/state/swap/swapSlice';
import { useSwapCallback } from '../../store/state/swap/useSwapCallback';
import { Token } from '../../store/state/tokens/tokensSlice';
import MainButton, { MainButtonType } from '../Buttons/MainButton';
import Modal, { ModalHeaderType } from '../Modal';

export interface SelectTokenModalProps {
  isOpen: boolean;
  closeModal: () => void;
}
interface SwapTokenBoxProps {
  field: Field;
  token: Token;
  amount: string;
}
const SwapTokenBox = ({ field, token, amount }: SwapTokenBoxProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #E3E7EE',
        borderRadius: '16px',
        mb: '10px',
        padding: '17px 17px 21px',
      }}>
      <Typography
        variant="rxs12"
        sx={{
          color: 'dark.700',
          mb: '17px',
        }}>
        {field === Field.INPUT ? 'You sell' : 'You get'}
      </Typography>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box sx={{ display: 'flex' }}>
          <img style={{ width: '24px', height: '24px' }} src={token.logoURI} alt="logo" />
          <Typography variant="mxlg20" sx={{ margin: '0 12px 0' }}>
            {token.symbol}
          </Typography>
        </Box>
        <Typography variant="rxxlg24">{amount}</Typography>
      </Stack>
    </Box>
  );
};

const ConfirmSwapModal = ({ isOpen, closeModal }: SelectTokenModalProps) => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const { INPUT, OUTPUT, typedValue, swapInfo, slippage } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap.INPUT],
    OUTPUT: state.tokens.tokens[state.swap.OUTPUT],
    typedValue: state.swap.typedValue,
    swapInfo: state.swap.swapInfo,
    slippage: state.swap.slippage,
  }));

  useEffect(() => {
    if (INPUT && OUTPUT) {
      dispatch(
        fetchSwap({
          fromTokenAddress: INPUT.address,
          toTokenAddress: OUTPUT.address,
          amount: typedValue,
          fromAddress: String(account),
          slippage,
          disableEstimate: true,
        })
      );
    }
  }, [INPUT, OUTPUT, account, typedValue]);

  const txData: TransactionRequest = {
    from: swapInfo?.tx?.from,
    to: swapInfo?.tx?.to,
    data: swapInfo?.tx?.data,
    value: swapInfo?.tx?.value,
    gasPrice: swapInfo?.tx?.gasPrice,
  };

  const swapCallback = useSwapCallback(txData);

  const handleSendTx = useCallback(() => {
    try {
      swapCallback();
    } catch (error) {
      console.error(error);
    }
  }, [swapCallback]);

  return (
    <Modal headerType={ModalHeaderType.Confirm} closeModal={closeModal} isOpen={isOpen}>
      <SwapTokenBox field={Field.INPUT} token={INPUT} amount={formatUnits(typedValue || '0x00')} />
      <SwapTokenBox
        field={Field.OUTPUT}
        token={OUTPUT}
        amount={formatUnits(swapInfo?.toTokenAmount || '0x00')}
      />
      <Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            variant="rxs12"
            sx={{
              color: 'dark.700',
              mb: '9px',
            }}>
            Gas price
          </Typography>
          <Typography variant="rxs12">
            {formatUnits(swapInfo?.tx?.gasPrice || '0x00', 'gwei')} Gwei
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            variant="rxs12"
            sx={{
              color: 'dark.700',
              mb: '9px',
            }}>
            Slippage
          </Typography>
          <Typography variant="rxs12">{slippage}%</Typography>
        </Stack>
      </Stack>
      <svg
        style={{
          marginBottom: '10px',
        }}
        height="1"
        viewBox="0 0 386 1"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <rect width="386" height="1" fill="#E3E7EE" />
      </svg>
      <MainButton
        type={MainButtonType.Confirm}
        onClick={handleSendTx}
        disabled={!(account && typedValue && swapInfo?.tx?.data)}
      />
    </Modal>
  );
};

export default ConfirmSwapModal;
