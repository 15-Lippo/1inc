import { formatUnits } from '@ethersproject/units';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';

import { REFRESH_QUOTE_DELAY_MS, SupportedChainId } from '../../../constants';
import { useInterval } from '../../../hooks';
import { useActiveWeb3React } from '../../../packages/web3-provider';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchSwap } from '../../../store/state/swap/swapSlice';
import { useSwapCallback } from '../../../store/state/swap/useSwapCallback';
import { useUpdateQuote } from '../../../store/state/swap/useUpdateQuote';
import { Token } from '../../../store/state/tokens/tokensSlice';
import { Field } from '../../../types';
import { formatGweiFixed, formatUsdFixed } from '../../../utils';
import { AuxButton, MainButton, MainButtonType, SlippageButtonsGroup } from '../../buttons';
import GasPriceOptions from '../../GasPriceOptions';
import { SwitchTokensIcon } from '../../icons';
import { RefreshRateWarningMsg } from '../../messages';
import { Modal, ModalHeaderType } from '../Modal';
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

enum RefreshStatus {
  NO_REFRESH_NEEDED,
  SHOULD_REFRESH,
  EXTERNAL_REFRESH_OCCURRED,
  INTERNAL_REFRESH_OCCURRED,
}

interface PriceState {
  input: string;
  output: string;
}

const ConfirmSwapModal = ({ isOpen, goBack, gasOptions }: ConfirmSwapModalProps) => {
  const dispatch = useAppDispatch();
  const { account, chainId } = useActiveWeb3React();
  const { INPUT, OUTPUT } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap.INPUT],
    OUTPUT: state.tokens.tokens[state.swap.OUTPUT],
  }));
  const updateQuote = useUpdateQuote();

  const { typedValue, swapInfo, slippage, txFeeCalculation, referrerOptions, lastQuoteUpdateTimestamp } =
    useAppSelector((state) => state.swap);

  const [price, setPrice] = useState<PriceState>({
    input: '0',
    output: '0',
  });
  const [slippageModalOpen, setSlippageModalOpen] = useState<boolean>(false);
  const [gasPriceModalOpen, setGasPriceModalOpen] = useState<boolean>(false);
  const [refreshStatus, setRefreshStatus] = useState<RefreshStatus>(RefreshStatus.NO_REFRESH_NEEDED);

  const [displayedToTokenAmount, setDisplayedToTokenAmount] = useState<string>('0');

  // if less than 5 seconds before next refresh, show suggest refresh button
  const updateRefreshStatus = () => {
    switch (refreshStatus) {
      case RefreshStatus.INTERNAL_REFRESH_OCCURRED:
      case RefreshStatus.EXTERNAL_REFRESH_OCCURRED:
        return;
      default: {
        const newStatus =
          performance.now() - lastQuoteUpdateTimestamp > REFRESH_QUOTE_DELAY_MS - 5000
            ? RefreshStatus.SHOULD_REFRESH
            : RefreshStatus.NO_REFRESH_NEEDED;
        if (newStatus !== refreshStatus) {
          setRefreshStatus(newStatus);
        }
      }
    }
  };

  // update refresh status every second
  useInterval(updateRefreshStatus, 1000);

  // if quote was updated externally, show red refresh button
  useEffect(() => {
    if (isOpen && refreshStatus !== RefreshStatus.INTERNAL_REFRESH_OCCURRED) {
      setRefreshStatus(RefreshStatus.EXTERNAL_REFRESH_OCCURRED);
    } else {
      setRefreshStatus(RefreshStatus.NO_REFRESH_NEEDED);
    }
  }, [lastQuoteUpdateTimestamp]);

  useEffect(() => {
    if (refreshStatus === RefreshStatus.INTERNAL_REFRESH_OCCURRED) {
      updateQuote();
    } else if (refreshStatus === RefreshStatus.NO_REFRESH_NEEDED) {
      setDisplayedToTokenAmount(swapInfo?.toTokenAmount || '0x00');
    }
  }, [refreshStatus, swapInfo]);

  useEffect(() => {
    isOpen && swapInfo && setDisplayedToTokenAmount(swapInfo.toTokenAmount);
  }, [isOpen]);

  useEffect(() => {
    const outputAmount = swapInfo?.toTokenAmount;
    if (Number(swapInfo?.toTokenAmount) && Number(typedValue)) {
      // @ts-ignore
      const output = typedValue / outputAmount;
      // @ts-ignore
      const input = outputAmount / typedValue;
      setPrice({
        input: input.toFixed(4),
        output: output.toFixed(4),
      });
    }
  }, [swapInfo?.toTokenAmount, typedValue]);

  useEffect(() => {
    if (!INPUT?.address || !OUTPUT?.address || !Number(typedValue) || !account) return;
    dispatch(
      fetchSwap({
        swapInfo: {
          fromTokenAddress: INPUT.address,
          toTokenAddress: OUTPUT.address,
          amount: typedValue,
          fromAddress: String(account),
          slippage,
          disableEstimate: true,
          gasLimit: txFeeCalculation?.gasLimit,
          ...(referrerOptions[chainId as SupportedChainId]?.referrerAddress
            ? referrerOptions[chainId as SupportedChainId]
            : {}),
        },
        chainId,
      })
    );
  }, [
    INPUT,
    OUTPUT,
    account,
    typedValue,
    slippage,
    txFeeCalculation?.gasPriceInfo.price,
    txFeeCalculation?.gasLimit,
    referrerOptions,
  ]);

  const swapCallback = useSwapCallback({
    from: swapInfo?.tx?.from,
    to: swapInfo?.tx?.to,
    data: swapInfo?.tx?.data,
    value: swapInfo?.tx?.value,
    gasLimit: txFeeCalculation?.gasLimit,
    ...(txFeeCalculation.gasPriceSettingsMode === 'basic'
      ? { gasPrice: txFeeCalculation.gasPriceInfo.price }
      : {
          maxFeePerGas: txFeeCalculation.customGasPrice.maxFee,
          maxPriorityFeePerGas: txFeeCalculation.customGasPrice.maxPriorityFee,
        }),
  });

  const handleSendTx = useCallback(() => {
    try {
      swapCallback();
    } catch (error) {
      console.error(error);
    }
  }, [swapCallback]);

  const onRefreshClick = () => {
    if (refreshStatus !== RefreshStatus.EXTERNAL_REFRESH_OCCURRED) {
      setRefreshStatus(RefreshStatus.INTERNAL_REFRESH_OCCURRED);
    } else {
      setRefreshStatus(RefreshStatus.NO_REFRESH_NEEDED);
    }
  };

  const inputUsdcPrice = INPUT?.priceInUsd && formatUsdFixed(INPUT?.priceInUsd);
  const outputUsdcPrice = OUTPUT?.priceInUsd && formatUsdFixed(OUTPUT?.priceInUsd);

  const gasPrice = formatGweiFixed(
    txFeeCalculation.gasPriceSettingsMode === 'basic'
      ? txFeeCalculation.gasPriceInfo.price
      : txFeeCalculation.customGasPrice.maxFee
  );

  return isOpen ? (
    <React.Fragment>
      <Modal headerType={ModalHeaderType.Confirm} goBack={goBack} isOpen={isOpen}>
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
              amount={parseFloat(formatUnits(displayedToTokenAmount)).toFixed(6)}
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
                  {price.input ? (
                    <Typography variant="rxs12" lineHeight="14px">{` ${price.input}  ${
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
                  {price.output ? (
                    <Typography variant="rxs12" lineHeight="14px">{` ${price.output}  ${
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
                    {`${gasPrice} Gwei`}
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
          {refreshStatus === RefreshStatus.NO_REFRESH_NEEDED ? (
            <MainButton
              type={MainButtonType.Confirm}
              onClick={handleSendTx}
              disabled={!(account && typedValue && swapInfo?.tx?.data)}
            />
          ) : (
            <Stack direction="column" spacing={1}>
              <RefreshRateWarningMsg
                inputTokenSymbol={INPUT.symbol}
                outputTokenSymbol={OUTPUT.symbol}
                quoteUpdated={refreshStatus === RefreshStatus.EXTERNAL_REFRESH_OCCURRED}
              />
              <MainButton
                type={MainButtonType.Refresh}
                onClick={onRefreshClick}
                disabled={!(account && typedValue && swapInfo?.tx?.data)}
                rateExpired={refreshStatus === RefreshStatus.EXTERNAL_REFRESH_OCCURRED}
              />
            </Stack>
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
