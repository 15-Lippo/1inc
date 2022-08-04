import { formatUnits } from '@ethersproject/units';
import { Box, Skeleton, Stack, Typography, useTheme } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { SupportedChainId } from '../../../constants';
import { useRate } from '../../../hooks/useRate';
import { useSingleTimeout } from '../../../hooks/useSingleTimeout';
import { useActiveWeb3React } from '../../../packages/web3-provider';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchSwap } from '../../../store/state/swap/swapSlice';
import { useSwapCallback } from '../../../store/state/swap/useSwapCallback';
import { useUsdStablecoins } from '../../../store/state/tokens/prices-in-usd/useUsdStablecoins';
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
  const { t } = useTranslation();
  const theme = useTheme();
  const text = field === Field.INPUT ? t('You sell') : t('You buy');
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${theme.palette.widget['border-01']}`,
        borderRadius: '16px',
        mb: '10px',
        padding: '17px 17px 21px',
      }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography
          variant="rxs12"
          sx={{
            color: 'widget.text-secondary',
            lineHeight: '14px',
            mb: '17px',
          }}>
          {text}
        </Typography>
        {usdcPrice ? (
          <Typography
            variant="rxs12"
            sx={{
              color: 'widget.text-secondary',
              lineHeight: '14px',
            }}>
            ~${usdcPrice}
          </Typography>
        ) : (
          <Skeleton
            sx={{
              bgcolor: 'widget.skeleton-00',
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
          <Typography color="widget.text-primary" variant="mxlg20" sx={{ margin: '0 12px 0' }}>
            {token.symbol}
          </Typography>
        </Box>
        {amount ? (
          <Typography color="widget.text-primary" variant="mxlg20" lineHeight="24px">
            {amount}
          </Typography>
        ) : (
          <Skeleton
            sx={{
              bgcolor: 'widget.skeleton-00',
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
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { account, chainId } = useActiveWeb3React();
  const { INPUT, OUTPUT, toTokenAmount } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap.INPUT],
    OUTPUT: state.tokens.tokens[state.swap.OUTPUT],
    toTokenAmount: state.swap.swapInfo?.toTokenAmount,
  }));

  const { typedValue, swapInfo, slippage, txFeeCalculation, referrerOptions } = useAppSelector((state) => state.swap);

  const [slippageModalOpen, setSlippageModalOpen] = useState<boolean>(false);
  const [gasPriceModalOpen, setGasPriceModalOpen] = useState<boolean>(false);
  const [loadingSwap, setLoadingSwap] = useState<boolean>(false);
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);

  const { startTimeout, abortTimeout } = useSingleTimeout(() => setShouldRefresh(true), 5000);
  const { defaultStablecoin } = useUsdStablecoins();

  const updateSwap = () => {
    if (!isOpen || !INPUT?.address || !OUTPUT?.address || !Number(typedValue) || !account) return;
    setLoadingSwap(true);

    const referrerOptionsByChainId = referrerOptions[chainId as SupportedChainId];
    dispatch(
      fetchSwap({
        swapInfo: {
          fromTokenAddress: INPUT.address,
          toTokenAddress: OUTPUT.address,
          amount: typedValue.toString(),
          fromAddress: String(account),
          slippage,
          disableEstimate: true,
          gasPrice: Number(txFeeCalculation?.customGasPrice?.maxFee)
            ? txFeeCalculation?.customGasPrice?.maxFee
            : txFeeCalculation?.gasPriceInfo?.price,
          gasLimit: txFeeCalculation?.gasLimit,
          referrerAddress: referrerOptionsByChainId?.referrerAddress,
          fee: referrerOptionsByChainId?.fee,
        },
        chainId,
      })
    );
  };

  const price = useRate((typedValue || '0').toString(), toTokenAmount || '0');

  useEffect(() => {
    if (isOpen) {
      startTimeout();
      updateSwap();
    } else {
      abortTimeout();
      setLoadingSwap(true);
    }
  }, [isOpen]);

  useEffect(() => {
    setShouldRefresh(false);
    setLoadingSwap(false);
    startTimeout();
  }, [swapInfo]);

  useEffect(() => {
    setShouldRefresh(true);
  }, [slippage, txFeeCalculation?.gasPriceInfo.price, txFeeCalculation?.gasLimit]);

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
    if (loadingSwap) return;
    try {
      swapCallback();
    } catch (error) {
      console.error(error);
    }
  }, [swapCallback]);

  const onRefreshClick = () => {
    updateSwap();
  };

  const inputUsdcPrice = INPUT?.priceInUsd && formatUsdFixed(INPUT?.priceInUsd, defaultStablecoin.decimals);
  const outputUsdcPrice = OUTPUT?.priceInUsd && formatUsdFixed(OUTPUT?.priceInUsd, defaultStablecoin.decimals);

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
              amount={
                toTokenAmount && OUTPUT && !loadingSwap
                  ? parseFloat(formatUnits(toTokenAmount, OUTPUT.decimals)).toFixed(6)
                  : ''
              }
              usdcPrice={outputUsdcPrice}
            />
            <Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: '9px' }}>
                <Typography
                  variant="rxs12"
                  sx={{
                    color: 'widget.text-secondary',
                    lineHeight: '14px',
                  }}>
                  1 {INPUT && INPUT.symbol} <Trans>price</Trans>
                </Typography>
                <Box sx={{ display: 'flex', columnGap: '4px' }}>
                  {inputUsdcPrice ? (
                    <Typography
                      variant="rxs12"
                      sx={{
                        lineHeight: '14px',
                        color: 'widget.text-secondary',
                      }}>
                      ~${inputUsdcPrice}
                    </Typography>
                  ) : (
                    <Skeleton
                      sx={{
                        bgcolor: 'widget.skeleton-00',
                      }}
                      animation="wave"
                      height={14}
                      width="60px"
                    />
                  )}
                  {price.input ? (
                    <Typography color="widget.text-primary" variant="rxs12" lineHeight="14px">{` ${price.input}  ${
                      INPUT && (INPUT.symbol === 'ETH' ? 'Ξ' : INPUT.symbol)
                    }`}</Typography>
                  ) : (
                    <Skeleton
                      sx={{
                        bgcolor: 'widget.skeleton-00',
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
                    color: 'widget.text-secondary',
                    lineHeight: '14px',
                  }}>
                  1 {OUTPUT && OUTPUT.symbol} <Trans>price</Trans>
                </Typography>
                <Box sx={{ display: 'flex', columnGap: '4px' }}>
                  {outputUsdcPrice ? (
                    <Typography
                      variant="rxs12"
                      sx={{
                        lineHeight: '14px',
                        color: 'widget.text-secondary',
                      }}>
                      ~${outputUsdcPrice}
                    </Typography>
                  ) : (
                    <Skeleton
                      sx={{
                        bgcolor: 'widget.skeleton-00',
                      }}
                      animation="wave"
                      height={14}
                      width="50px"
                    />
                  )}
                  {price.output ? (
                    <Typography color="widget.text-primary" variant="rxs12" lineHeight="14px">{` ${price.output}  ${
                      OUTPUT && (OUTPUT.symbol === 'ETH' ? 'Ξ' : OUTPUT.symbol)
                    }`}</Typography>
                  ) : (
                    <Skeleton
                      sx={{
                        bgcolor: 'widget.skeleton-00',
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
                    color: 'widget.text-secondary',
                    lineHeight: '14px',
                  }}>
                  <Trans>Gas price</Trans>
                </Typography>
                <Box sx={{ display: 'flex', columnGap: '4px' }}>
                  <AuxButton onClick={() => setGasPriceModalOpen(true)} text={t('Edit')} />
                  <Typography color="widget.text-primary" variant="rxs12" lineHeight="14px">
                    {`${gasPrice} Gwei`}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: '9px' }}>
                <Typography
                  variant="rxs12"
                  sx={{
                    color: 'widget.text-secondary',
                    lineHeight: '14px',
                  }}>
                  <Trans>Slippage</Trans>
                </Typography>
                <Box sx={{ display: 'flex', columnGap: '4px' }}>
                  <AuxButton onClick={() => setSlippageModalOpen(true)} text={t('Edit')} />
                  <Typography color="widget.text-primary" variant="rxs12" lineHeight="14px">
                    {slippage}%
                  </Typography>
                </Box>
              </Stack>
              <hr
                color={theme.palette.widget['border-01']}
                style={{
                  margin: '19px 0',
                  height: '1px',
                  borderWidth: 0,
                }}
              />
            </Stack>
          </Stack>
          {!shouldRefresh ? (
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
                quoteUpdated={shouldRefresh}
              />
              <MainButton
                type={MainButtonType.Refresh}
                onClick={onRefreshClick}
                disabled={!(account && typedValue && swapInfo?.tx?.data)}
                rateExpired={shouldRefresh}
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
