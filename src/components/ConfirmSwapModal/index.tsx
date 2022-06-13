import { formatUnits } from '@ethersproject/units';
import { Box, Link, Skeleton, Stack, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import React, { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSwap, Field } from '../../store/state/swap/swapSlice';
import { useCountdownQuote } from '../../store/state/swap/useCountdownQuote';
import { useSwapCallback } from '../../store/state/swap/useSwapCallback';
import { Token } from '../../store/state/tokens/tokensSlice';
import MainButton, { MainButtonType } from '../Buttons/MainButton';
import { SlippageButtonsGroup } from '../Buttons/SlippageButtonsGroup';
import SwitchTokensIcon from '../icons/SwitchTokensIcon';
import Modal, { ModalHeaderType } from '../Modal';
import RefreshRateWarningMsg from '../RefreshRateWarningMsg';
import SignTxModal from '../SignTxModal';
import TxSentModal from '../TxSentModal';

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
            lineHeight: '14px',
            mb: '17px',
          }}>
          {field === Field.INPUT ? 'You sell' : 'You get'}
        </Typography>
        {usdcPrice ? (
          <Typography
            variant="rxs12"
            sx={{
              color: 'dark.700',
              lineHeight: '14px',
            }}>
            ~${usdcPrice}
          </Typography>
        ) : (
          <Skeleton
            sx={{
              bgcolor: 'cool.100',
            }}
            animation="wave"
            height={14}
            width="60px"
          />
        )}
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box sx={{ display: 'flex' }}>
          <img style={{ width: '24px', height: '24px' }} src={token.logoURI} alt="logo" />
          <Typography variant="mxlg20" sx={{ margin: '0 12px 0' }}>
            {token.symbol}
          </Typography>
        </Box>
        {amount ? (
          <Typography variant="rxxlg24" lineHeight="28px">
            {amount}
          </Typography>
        ) : (
          <Skeleton
            sx={{
              bgcolor: 'cool.100',
            }}
            animation="wave"
            height={28}
            width="110px"
          />
        )}
      </Stack>
    </Box>
  );
};

const ConfirmSwapModal = ({ isOpen, goBack }: SelectTokenModalProps) => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const { countdown, reset } = useCountdownQuote();
  const gasPriceInfo = useAppSelector((state) => state.swap.txFeeCalculation?.gasPriceInfo);
  const { INPUT, OUTPUT } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap.INPUT],
    OUTPUT: state.tokens.tokens[state.swap.OUTPUT],
  }));

  const { typedValue, swapInfo, slippage, tokenPriceInUsd, txFeeCalculation } = useAppSelector(
    (state) => state.swap
  );

  const [outputPrice, setOutputPrice] = useState<string>('0');
  const [inputPrice, setInputPrice] = useState<string>('0');
  const [slippageModalOpen, setSlippageModalOpen] = useState<boolean>(false);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [quoteUpdated, setQuoteUpdated] = useState<boolean>(false);

  const refreshTimeInterval = countdown > 0 && countdown <= 7;

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
  }, [swapInfo?.toTokenAmount, typedValue]);

  useEffect(() => {
    if (!INPUT?.address || !OUTPUT?.address || !Number(typedValue) || !account) return;
    dispatch(
      fetchSwap({
        fromTokenAddress: INPUT.address,
        toTokenAddress: OUTPUT.address,
        amount: typedValue,
        fromAddress: String(account),
        slippage,
        disableEstimate: true,
        gasLimit: txFeeCalculation?.gasLimit,
      })
    );
  }, [
    INPUT,
    OUTPUT,
    account,
    typedValue,
    isRefresh,
    slippage,
    gasPriceInfo?.price,
    txFeeCalculation?.gasLimit,
  ]);

  const swapCallback = useSwapCallback({
    from: swapInfo?.tx?.from,
    to: swapInfo?.tx?.to,
    data: swapInfo?.tx?.data,
    value: swapInfo?.tx?.value,
    gasLimit: txFeeCalculation?.gasLimit,
    gasPrice: gasPriceInfo?.price,
  });

  const handleSendTx = useCallback(() => {
    try {
      swapCallback();
    } catch (error) {
      console.error(error);
    }
  }, [swapCallback]);

  const onRefresh = () => {
    setIsRefresh(!isRefresh);
    setQuoteUpdated(false);
    reset();
  };

  useEffect(() => {
    if (isOpen && countdown === 1) setQuoteUpdated(true);
  }, [countdown]);

  const inputUsdcPrice =
    tokenPriceInUsd &&
    tokenPriceInUsd.input &&
    parseFloat(formatUnits(tokenPriceInUsd.input, 6)).toFixed(2);
  const outputUsdcPrice =
    tokenPriceInUsd &&
    tokenPriceInUsd.output &&
    parseFloat(formatUnits(tokenPriceInUsd.output, 6)).toFixed(2);

  return isOpen ? (
    <>
      <Modal
        headerType={ModalHeaderType.Confirm}
        goBack={() => {
          goBack();
          setQuoteUpdated(false);
        }}
        isOpen={isOpen}>
        <Stack direction="column">
          <Box>
            <SwapTokenBox
              field={Field.INPUT}
              token={INPUT}
              amount={formatUnits(typedValue || '0x00')}
              usdcPrice={inputUsdcPrice}
            />
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}>
              <SwitchTokensIcon />
            </Box>
            <SwapTokenBox
              field={Field.OUTPUT}
              token={OUTPUT}
              amount={parseFloat(formatUnits(swapInfo?.toTokenAmount || '0x00')).toFixed(6)}
              usdcPrice={outputUsdcPrice}
            />
            <Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: '9px' }}>
                <Typography
                  variant="rxs12"
                  sx={{
                    color: 'dark.700',
                    lineHeight: '14px',
                  }}>
                  1 {INPUT && INPUT.symbol} price
                </Typography>
                <Box sx={{ display: 'flex', columnGap: '4px' }}>
                  {tokenPriceInUsd ? (
                    <Typography
                      variant="rxs12"
                      sx={{
                        lineHeight: '14px',
                        color: 'dark.700',
                      }}>
                      ~${inputUsdcPrice}
                    </Typography>
                  ) : (
                    <Skeleton
                      sx={{
                        bgcolor: 'cool.100',
                      }}
                      animation="wave"
                      height={14}
                      width="60px"
                    />
                  )}
                  {inputPrice ? (
                    <Typography variant="rxs12" lineHeight="14px">{` ${inputPrice}  ${
                      INPUT && (INPUT.symbol === 'ETH' ? 'Ξ' : INPUT.symbol)
                    }`}</Typography>
                  ) : (
                    <Skeleton
                      sx={{
                        bgcolor: 'cool.100',
                      }}
                      animation="wave"
                      height={14}
                      width="80px"
                    />
                  )}
                </Box>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: '9px' }}>
                <Typography
                  variant="rxs12"
                  sx={{
                    color: 'dark.700',
                    lineHeight: '14px',
                  }}>
                  1 {OUTPUT && OUTPUT.symbol} price
                </Typography>
                <Box sx={{ display: 'flex', columnGap: '4px' }}>
                  {tokenPriceInUsd ? (
                    <Typography
                      variant="rxs12"
                      sx={{
                        lineHeight: '14px',
                        color: 'dark.700',
                      }}>
                      ~${outputUsdcPrice}
                    </Typography>
                  ) : (
                    <Skeleton
                      sx={{
                        bgcolor: 'cool.100',
                      }}
                      animation="wave"
                      height={14}
                      width="50px"
                    />
                  )}
                  {outputPrice ? (
                    <Typography variant="rxs12" lineHeight="14px">{` ${outputPrice}  ${
                      OUTPUT && (OUTPUT.symbol === 'ETH' ? 'Ξ' : OUTPUT.symbol)
                    }`}</Typography>
                  ) : (
                    <Skeleton
                      sx={{
                        bgcolor: 'cool.100',
                      }}
                      animation="wave"
                      height={14}
                      width="70px"
                    />
                  )}
                </Box>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: '9px' }}>
                <Typography
                  variant="rxs12"
                  sx={{
                    color: 'dark.700',
                    lineHeight: '14px',
                  }}>
                  Gas price
                </Typography>
                <Typography variant="rxs12" lineHeight="14px">
                  {parseFloat(formatUnits(swapInfo?.tx?.gasPrice || '0x00', 'gwei')).toFixed(2)}{' '}
                  Gwei
                </Typography>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: '9px' }}>
                <Typography
                  variant="rxs12"
                  sx={{
                    color: 'dark.700',
                    lineHeight: '14px',
                  }}>
                  Slippage
                </Typography>
                <Box sx={{ display: 'flex', columnGap: '4px' }}>
                  <Link
                    variant="rxs12"
                    lineHeight="14px"
                    href="#"
                    underline="none"
                    onClick={() => setSlippageModalOpen(true)}>
                    Edit
                  </Link>
                  <Typography variant="rxs12" lineHeight="14px">
                    {slippage}%
                  </Typography>
                </Box>
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
          {refreshTimeInterval || quoteUpdated ? (
            <Stack direction="column" spacing={1}>
              <RefreshRateWarningMsg
                inputTokenSymbol={INPUT.symbol}
                outputTokenSymbol={OUTPUT.symbol}
                quoteUpdated={quoteUpdated}
              />
              <MainButton
                type={MainButtonType.Refresh}
                onClick={onRefresh}
                disabled={!(account && typedValue && swapInfo?.tx?.data)}
                rateExpired={quoteUpdated}
              />
            </Stack>
          ) : (
            !quoteUpdated && (
              <MainButton
                type={MainButtonType.Confirm}
                onClick={handleSendTx}
                disabled={!(account && typedValue && swapInfo?.tx?.data)}
              />
            )
          )}
        </Stack>
      </Modal>
      <Modal
        goBack={() => setSlippageModalOpen(false)}
        isOpen={slippageModalOpen}
        sx={{
          minHeight: '537px',
        }}
        headerType={ModalHeaderType.Slippage}>
        <SlippageButtonsGroup />
      </Modal>
      <SignTxModal />
      <TxSentModal />
    </>
  ) : null;
};

export default ConfirmSwapModal;
