import { formatUnits } from '@ethersproject/units';
import { Avatar, Box, Stack, Typography, useTheme } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { useRate, useSingleTimeout } from '../../../hooks';
import { useActiveWeb3React } from '../../../packages';
import { fetchSwap, Token, useAppDispatch, useAppSelector, useSwapCallback, useUsdStablecoins } from '../../../store';
import { Field, SupportedChainId } from '../../../types';
import { formatGweiFixed, formatUsdFixed } from '../../../utils';
import { AuxButton, MainButton, MainButtonType, SlippageButtonsGroup } from '../../buttons';
import GasPriceOptions from '../../GasPriceOptions';
import { NoLogoURI, SwitchTokensIcon } from '../../icons';
import { RefreshRateWarningMsg } from '../../messages';
import SkeletonText from '../../SkeletonText';
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
        <Typography variant="rxs12" lineHeight="14px" color="widget.text-secondary" sx={{ mb: '17px' }}>
          {text}
        </Typography>
        {usdcPrice ? (
          <Typography variant="rxs12" lineHeight="14px" color="widget.text-secondary">
            ~${usdcPrice}
          </Typography>
        ) : (
          <SkeletonText width="60px" height="14px" />
        )}
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box sx={{ display: 'flex' }}>
          <Avatar src={token.logoURI} sx={{ width: 24, height: 24, backgroundColor: 'transparent' }}>
            <NoLogoURI />
          </Avatar>
          <Typography variant="mxlg20" lineHeight="24px" color="widget.text-primary" sx={{ margin: '0 12px' }}>
            {token.symbol}
          </Typography>
        </Box>
        {amount ? (
          <Typography variant="mxlg20" lineHeight="24px" color="widget.text-primary">
            {amount}
          </Typography>
        ) : (
          <SkeletonText width="110px" height="24px" />
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
  const { INPUT, OUTPUT, toTokenAmount, lastQuoteUpdateTimestamp } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap.INPUT],
    OUTPUT: state.tokens.tokens[state.swap.OUTPUT],
    toTokenAmount: state.swap.swapInfo?.toTokenAmount,
    lastQuoteUpdateTimestamp: state.swap.lastQuoteUpdateTimestamp,
  }));

  const { typedValue, swapInfo, slippage, txFeeCalculation, referrerOptions } = useAppSelector((state) => state.swap);

  const [slippageModalOpen, setSlippageModalOpen] = useState<boolean>(false);
  const [gasPriceModalOpen, setGasPriceModalOpen] = useState<boolean>(false);
  const [loadingSwap, setLoadingSwap] = useState<boolean>(false);
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);

  const { startTimeout, abortTimeout } = useSingleTimeout(() => setShouldRefresh(true), 5000);
  const { defaultStablecoin } = useUsdStablecoins();

  const updateSwap = () => {
    if (!INPUT?.address || !OUTPUT?.address || !Number(typedValue) || !account) return;
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
          // TODO https://github.com/yozh-io/1inch-widget/issues/236
          // gasLimit: txFeeCalculation?.gasLimit,
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
    if (!INPUT?.userBalance) return;
    !isOpen && updateSwap();
  }, [lastQuoteUpdateTimestamp]);

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
    // gasLimit: txFeeCalculation?.gasLimit,
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

  const inputUsdcPrice =
    INPUT?.priceInUsd && defaultStablecoin && formatUsdFixed(INPUT?.priceInUsd, defaultStablecoin.decimals);
  const outputUsdcPrice =
    OUTPUT?.priceInUsd && defaultStablecoin && formatUsdFixed(OUTPUT?.priceInUsd, defaultStablecoin.decimals);

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
              amount={formatUnits(typedValue || '0x00', INPUT.decimals)}
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
                <Typography variant="rxs12" lineHeight="14px" color="widget.text-secondary">
                  1 {INPUT && INPUT.symbol} <Trans>price</Trans>
                </Typography>
                <Box sx={{ display: 'flex', columnGap: '4px' }}>
                  {inputUsdcPrice ? (
                    <Typography variant="rxs12" lineHeight="14px" color="widget.text-secondary">
                      ~${inputUsdcPrice}
                    </Typography>
                  ) : (
                    <SkeletonText width="60px" height="14px" />
                  )}
                  {price.input ? (
                    <Typography variant="rxs12" lineHeight="14px" color="widget.text-primary">
                      {` ${price.input}  ${INPUT && (INPUT.symbol === 'ETH' ? 'Ξ' : INPUT.symbol)}`}
                    </Typography>
                  ) : (
                    <SkeletonText width="80px" height="14px" />
                  )}
                </Box>
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: '9px' }}>
                <Typography variant="rxs12" lineHeight="14px" color="widget.text-secondary">
                  1 {OUTPUT && OUTPUT.symbol} <Trans>price</Trans>
                </Typography>
                <Box sx={{ display: 'flex', columnGap: '4px' }}>
                  {outputUsdcPrice ? (
                    <Typography variant="rxs12" lineHeight="14px" color="widget.text-secondary">
                      ~${outputUsdcPrice}
                    </Typography>
                  ) : (
                    <SkeletonText width="50px" height="14px" />
                  )}
                  {price.output ? (
                    <Typography variant="rxs12" lineHeight="14px" color="widget.text-primary">
                      {` ${price.output}  ${OUTPUT && (OUTPUT.symbol === 'ETH' ? 'Ξ' : OUTPUT.symbol)}`}
                    </Typography>
                  ) : (
                    <SkeletonText width="70px" height="14px" />
                  )}
                </Box>
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: '9px' }}>
                <Typography variant="rxs12" lineHeight="14px" color="widget.text-secondary">
                  <Trans>Gas price</Trans>
                </Typography>
                <Box sx={{ display: 'flex', columnGap: '4px' }}>
                  <AuxButton onClick={() => setGasPriceModalOpen(true)} text={t('Edit')} />
                  <Typography variant="rxs12" lineHeight="14px" color="widget.text-primary">
                    {`${gasPrice} Gwei`}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: '9px' }}>
                <Typography variant="rxs12" lineHeight="14px" color="widget.text-secondary">
                  <Trans>Slippage</Trans>
                </Typography>
                <Box sx={{ display: 'flex', columnGap: '4px' }}>
                  <AuxButton onClick={() => setSlippageModalOpen(true)} text={t('Edit')} />
                  <Typography variant="rxs12" lineHeight="14px" color="widget.text-primary">
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
