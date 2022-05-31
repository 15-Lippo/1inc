import { TransactionRequest } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import { Box, Stack, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import React, { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSwap, Field } from '../../store/state/swap/swapSlice';
import { useSwapCallback } from '../../store/state/swap/useSwapCallback';
import { Token } from '../../store/state/tokens/tokensSlice';
import MainButton, { MainButtonType } from '../Buttons/MainButton';
import Modal, { ModalHeaderType } from '../Modal';

export interface SelectTokenModalProps {
  isOpen: boolean;
  goBack: () => void;
}
interface SwapTokenBoxProps {
  field: Field;
  token: Token;
  amount: string;
  usdcPrice?: string;
}
const SwapTokenBox = ({ field, token, amount, usdcPrice }: SwapTokenBoxProps) => {
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
      <Stack direction="row" justifyContent="space-between">
        <Typography
          variant="rxs12"
          sx={{
            color: 'dark.700',
            mb: '17px',
          }}>
          {field === Field.INPUT ? 'You sell' : 'You get'}
        </Typography>
        {usdcPrice && (
          <Typography
            variant="rxs12"
            sx={{
              color: 'dark.700',
            }}>
            ~${usdcPrice}
          </Typography>
        )}
      </Stack>
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

const ConfirmSwapModal = ({ isOpen, goBack }: SelectTokenModalProps) => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const { INPUT, OUTPUT } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap.INPUT],
    OUTPUT: state.tokens.tokens[state.swap.OUTPUT],
  }));

  const { typedValue, swapInfo, slippage, tokenPriceInUsd, loadingQuote } = useAppSelector(
    (state) => state.swap
  );

  const [outputPrice, setOutputPrice] = useState<string>('0');
  const [inputPrice, setInputPrice] = useState<string>('0');

  useEffect(() => {
    const outputAmount = swapInfo?.toTokenAmount;
    if (Number(swapInfo?.toTokenAmount) && Number(typedValue)) {
      // @ts-ignore
      const output = typedValue / outputAmount;
      // @ts-ignore
      const input = outputAmount / typedValue;
      setInputPrice(input.toFixed(4));
      setOutputPrice(output.toFixed(4));
    }
  }, [swapInfo?.toTokenAmount, typedValue, loadingQuote]);

  useEffect(() => {
    if (!INPUT?.address || !OUTPUT?.address || !typedValue || !account) return;
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
  }, [INPUT, OUTPUT, account, typedValue, loadingQuote]);

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

  const inputUsdcPrice =
    tokenPriceInUsd &&
    tokenPriceInUsd.input &&
    parseFloat(formatUnits(tokenPriceInUsd.input, 6)).toFixed(2);
  const outputUsdcPrice =
    tokenPriceInUsd &&
    tokenPriceInUsd.output &&
    parseFloat(formatUnits(tokenPriceInUsd.output, 6)).toFixed(2);

  return (
    <Modal headerType={ModalHeaderType.Confirm} goBack={goBack} isOpen={isOpen}>
      <Stack direction="column">
        <Box>
          <SwapTokenBox
            field={Field.INPUT}
            token={INPUT}
            amount={formatUnits(typedValue || '0x00')}
            usdcPrice={inputUsdcPrice}
          />
          <SwapTokenBox
            field={Field.OUTPUT}
            token={OUTPUT}
            amount={parseFloat(formatUnits(swapInfo?.toTokenAmount || '0x00')).toFixed(6)}
            usdcPrice={outputUsdcPrice}
          />
          <Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography
                variant="rxs12"
                sx={{
                  color: 'dark.700',
                  mb: '9px',
                }}>
                1 {INPUT && INPUT.symbol} price
              </Typography>
              <Box>
                {tokenPriceInUsd && (
                  <Typography
                    variant="rxs12"
                    sx={{
                      color: 'dark.700',
                    }}>
                    ~${inputUsdcPrice}
                  </Typography>
                )}
                <Typography variant="rxs12">{` ${inputPrice}  ${
                  INPUT && (INPUT.symbol === 'ETH' ? 'Ξ' : INPUT.symbol)
                }`}</Typography>
              </Box>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography
                variant="rxs12"
                sx={{
                  color: 'dark.700',
                  mb: '9px',
                }}>
                1 {OUTPUT && OUTPUT.symbol} price
              </Typography>
              <Box>
                {tokenPriceInUsd && (
                  <Typography
                    variant="rxs12"
                    sx={{
                      color: 'dark.700',
                    }}>
                    ~${outputUsdcPrice}
                  </Typography>
                )}
                <Typography variant="rxs12">{` ${outputPrice}  ${
                  OUTPUT && (OUTPUT.symbol === 'ETH' ? 'Ξ' : OUTPUT.symbol)
                }`}</Typography>
              </Box>
            </Stack>

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
                {parseFloat(formatUnits(swapInfo?.tx?.gasPrice || '0x00', 'gwei')).toFixed(2)} Gwei
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
        </Box>
        <MainButton
          type={MainButtonType.Confirm}
          onClick={handleSendTx}
          disabled={!(account && typedValue && swapInfo?.tx?.data)}
        />
      </Stack>
    </Modal>
  );
};

export default ConfirmSwapModal;
