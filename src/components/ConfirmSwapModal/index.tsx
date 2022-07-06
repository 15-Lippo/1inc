import { formatUnits } from '@ethersproject/units';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';

import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSwap, Field } from '../../store/state/swap/swapSlice';
import { useCountdownQuote } from '../../store/state/swap/useCountdownQuote';
import { useSwapCallback } from '../../store/state/swap/useSwapCallback';
import { Token } from '../../store/state/tokens/tokensSlice';
import AuxButton from '../Buttons/AuxButton';
import MainButton, { MainButtonType } from '../Buttons/MainButton';
import { SlippageButtonsGroup } from '../Buttons/SlippageButtonsGroup';
import GasPriceOptions from '../GasPriceOptions';
import SwitchTokensIcon from '../icons/SwitchTokensIcon';
import { Modal, ModalHeaderType } from '../Modal';
import RefreshRateWarningMsg from '../RefreshRateWarningMsg';
import SignTxModal from '../SignTxModal';
import TxSentModal from '../TxSentModal';

interface ConfirmSwapModalProps {
  isOpen: boolean;
  goBack: () => void;
  gasOptions: any;
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
          <Typography variant="mxlg20" lineHeight="24px">
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

const ConfirmSwapModal = ({ isOpen, goBack, gasOptions }: ConfirmSwapModalProps) => {
  const dispatch = useAppDispatch();
  const { account } = useActiveWeb3React();
  const { countdown, reset } = useCountdownQuote();
  const { INPUT, OUTPUT, gasPriceInfo } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap.INPUT],
    OUTPUT: state.tokens.tokens[state.swap.OUTPUT],
    gasPriceInfo: state.swap.txFeeCalculation?.gasPriceInfo,
  }));

  const { typedValue, swapInfo, slippage, txFeeCalculation, referrerOptions } = useAppSelector((state) => state.swap);

  const [outputPrice, setOutputPrice] = useState<string>('0');
  const [inputPrice, setInputPrice] = useState<string>('0');
  const [slippageModalOpen, setSlippageModalOpen] = useState<boolean>(false);
  const [gasPriceModalOpen, setGasPriceModalOpen] = useState<boolean>(false);
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
        ...(referrerOptions.referrerAddress ? referrerOptions : {}),
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
    referrerOptions,
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

  const inputUsdcPrice = INPUT?.priceInUsd && parseFloat(formatUnits(INPUT?.priceInUsd, 6)).toFixed(2);
  const outputUsdcPrice = OUTPUT?.priceInUsd && parseFloat(formatUnits(OUTPUT?.priceInUsd, 6)).toFixed(2);

  return isOpen ? (
    <React.Fragment>
      <Modal
        headerType={ModalHeaderType.Confirm}
        goBack={() => {
          goBack();
          setQuoteUpdated(false);
        }}
        isOpen={isOpen}>
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <Stack direction="column">
            <SwapTokenBox
              field={Field.INPUT}
              token={INPUT}
              amount={formatUnits(typedValue || '0x00')}
              usdcPrice={inputUsdcPrice}
            />
            <SwitchTokensIcon
              style={{
                position: 'absolute',
                left: '50%',
                top: '31.5%',
                transform: 'translate(-50%, -50%)',
              }}
            />
            <SwapTokenBox
              field={Field.OUTPUT}
              token={OUTPUT}
              amount={parseFloat(formatUnits(swapInfo?.toTokenAmount || '0x00')).toFixed(6)}
              usdcPrice={outputUsdcPrice}
            />
            <Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: '9px' }}>
                <Typography
                  variant="rxs12"
                  sx={{
                    color: 'dark.700',
                    lineHeight: '14px',
                  }}>
                  1 {INPUT && INPUT.symbol} price
                </Typography>
                <Box sx={{ display: 'flex', columnGap: '4px' }}>
                  {inputUsdcPrice ? (
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

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: '9px' }}>
                <Typography
                  variant="rxs12"
                  sx={{
                    color: 'dark.700',
                    lineHeight: '14px',
                  }}>
                  1 {OUTPUT && OUTPUT.symbol} price
                </Typography>
                <Box sx={{ display: 'flex', columnGap: '4px' }}>
                  {outputUsdcPrice ? (
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

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: '9px' }}>
                <Typography
                  variant="rxs12"
                  sx={{
                    color: 'dark.700',
                    lineHeight: '14px',
                  }}>
                  Gas price
                </Typography>
                <Box sx={{ display: 'flex', columnGap: '4px' }}>
                  <AuxButton onClick={() => setGasPriceModalOpen(true)} text="Edit" />
                  <Typography variant="rxs12" lineHeight="14px">
                    {parseFloat(formatUnits(gasPriceInfo?.price || '0x00', 'gwei')).toFixed(2)} Gwei
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: '9px' }}>
                <Typography
                  variant="rxs12"
                  sx={{
                    color: 'dark.700',
                    lineHeight: '14px',
                  }}>
                  Slippage
                </Typography>
                <Box sx={{ display: 'flex', columnGap: '4px' }}>
                  <AuxButton onClick={() => setSlippageModalOpen(true)} text="Edit" />
                  <Typography variant="rxs12" lineHeight="14px">
                    {slippage}%
                  </Typography>
                </Box>
              </Stack>
              <hr
                color="#E3E7EE"
                style={{
                  margin: '19px 0',
                  height: '1px',
                  borderWidth: 0,
                }}
              />
            </Stack>
          </Stack>
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
        </Box>
      </Modal>
      <Modal
        goBack={() => setSlippageModalOpen(false)}
        isOpen={slippageModalOpen}
        headerType={ModalHeaderType.Slippage}>
        <Box sx={{ height: '100%' }}>
          <SlippageButtonsGroup />
        </Box>
      </Modal>
      <Modal
        goBack={() => setGasPriceModalOpen(false)}
        isOpen={gasPriceModalOpen}
        headerType={ModalHeaderType.GasPrice}>
        <Box sx={{ height: '100%' }}>
          <GasPriceOptions gasOptions={gasOptions} />
        </Box>
      </Modal>
      <SignTxModal />
      <TxSentModal />
    </React.Fragment>
  ) : null;
};

export default ConfirmSwapModal;
