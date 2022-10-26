import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { Box } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useMemo, useState } from 'react';

import { REFRESH_QUOTE_DELAY_MS, Tokens } from '../../constants';
import { useAlertMessage, useGasPriceOptions, useInterval } from '../../hooks';
import { useUpdate } from '../../hooks';
import { useApprove, useUpdateSpender } from '../../hooks/approve/useApprove';
import { useApproveStatus } from '../../hooks/approve/useApproveStatus';
import {
  applyDefaultSettings,
  ApproveStatus,
  cleanLastTxHash,
  setExplorer,
  setGasPriceInfo,
  useAppDispatch,
  useAppSelector,
  useTokens,
  useUpdateQuote,
} from '../../store';
import { Field, SupportedGasOptions } from '../../types';
import { totalRouteSteps } from '../../utils';
import { MainButton, MainButtonType, SwitchTokensButton } from '../buttons';
import GetBox from '../GetBox';
import {
  AddTokenModal,
  AlertModal,
  ConfirmSwapModal,
  ConnectionModal,
  Modal,
  ModalHeaderType,
  RouteModal,
  SelectTokenModal,
  SettingsModal,
} from '../modals';
import RateSection from '../RateSection';
import SendBox from '../SendBox';

export type SwapProps = {
  width?: string | number;
};

function Swap({ width }: SwapProps) {
  const dispatch = useAppDispatch();
  const { account, chainId } = useWeb3React();
  const { gasOptions, blockNum } = useGasPriceOptions();
  useTokens();
  const {
    INPUT,
    typedValue,
    protocols,
    tokensList,
    quoteError,
    swapError,
    loadingQuote,
    referrerOptions,
    inputToken,
    outputToken,
    txFeeCalculation,
    lastQuoteUpdateTimestamp,
    selectedMethod,
  } = useAppSelector((state) => ({
    loadingQuote: state.swap.loadingQuote,
    quoteError: state.swap.quoteError,
    swapError: state.swap.swapError,
    INPUT: state.swap.INPUT,
    // OUTPUT: state.swap.OUTPUT,
    typedValue: state.swap.typedValue,
    protocols: state.swap.quoteInfo?.protocols,
    tokensList: state.tokens.tokens,
    // lastTxHash: state.transactions.lastTxHash,
    referrerOptions: state.swap.referrerOptions,
    inputToken: state.tokens.tokens[state.swap[Field.INPUT]] || {},
    outputToken: state.tokens.tokens[state.swap[Field.OUTPUT]] || {},
    lastQuoteUpdateTimestamp: state.swap.lastQuoteUpdateTimestamp,
    txFeeCalculation: state.swap.txFeeCalculation,
    selectedMethod: state.swap.selectedMethod,
  }));

  const update = useUpdate();
  const { approve, updateAllowance } = useApprove();
  const status = useApproveStatus();

  const [isConfirmOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [isAddTokenOpen, setAddTokenOpen] = useState<boolean>(false);
  const [isRouteOpen, setRouteOpen] = useState<boolean>(false);
  const [isConnectionOpen, setConnectionOpen] = useState<boolean>(false);
  const [isSelectTokenOpen, setSelectTokenOpen] = useState({
    field: Field.INPUT,
    open: false,
  });
  const { errorMessage, shouldOpenModal, clearMessage } = useAlertMessage();
  const updateQuote = useUpdateQuote();
  const gasOptionLabel = SupportedGasOptions[txFeeCalculation.gasPriceInfo.label] ?? SupportedGasOptions.High;
  useUpdateSpender();

  const widgetWidth = useMemo(() => {
    if (width && width < 400) {
      console.warn(`Widget width must be at least 300px (you set it to ${width}). Falling back to 400px.`);
      return 400;
    }
    return width ?? 400;
  }, [width]);

  useEffect(() => {
    dispatch(setGasPriceInfo(gasOptions[gasOptionLabel]));
  }, [gasOptions[SupportedGasOptions.High]?.price]);

  useEffect(() => {
    if (chainId) {
      dispatch(cleanLastTxHash());
      dispatch(setExplorer({ chainId }));
      dispatch(applyDefaultSettings({ chainId }));
    }
  }, [chainId]);

  useEffect(() => {
    updateAllowance();
  }, [INPUT, selectedMethod, account, chainId]);

  const hasEnoughBalanceByAddress = (paymentCost: BigNumberish, tokenAddress: string): boolean => {
    const balance = tokensList[tokenAddress]?.userBalance || '0';
    return BigNumber.from(paymentCost).lte(balance);
  };

  const handleApproveClick = () => {
    // TODO add gasPrice check
    // if (!hasEnoughBalanceByAddress(approvalTxFee, Tokens.NATIVE_TOKEN_ADDRESS)) {
    //   setErrorMessage({
    //     text: t('Insufficient balance to pay for gas'),
    //     title: t('Alert'),
    //   });
    //   return;
    // }
    approve();
  };

  const hasEnoughNativeTokenBalanceToSwap = () => {
    let paymentCost = BigNumber.from(txFeeCalculation?.txFee);
    if (INPUT === Tokens.NATIVE_TOKEN_ADDRESS) {
      paymentCost = paymentCost.add(typedValue);
    }
    return hasEnoughBalanceByAddress(paymentCost, Tokens.NATIVE_TOKEN_ADDRESS);
  };

  const mainButtonByType = () => {
    if (!account) return <MainButton type={MainButtonType.Connect} onClick={() => setConnectionOpen(true)} />;
    if (!Number(typedValue)) return <MainButton type={MainButtonType.EnterAmount} />;
    if ((quoteError || swapError) && account) return <MainButton type={MainButtonType.Error} />;
    if (status === ApproveStatus.APPROVAL_NEEDED)
      return (
        <MainButton
          type={MainButtonType.Approve}
          onClick={handleApproveClick}
          disabled={loadingQuote !== 'succeeded'}
        />
      );
    if (!hasEnoughNativeTokenBalanceToSwap())
      return <MainButton type={MainButtonType.InsufficientNativeTokenBalance} />;
    if (!hasEnoughBalanceByAddress(typedValue, INPUT)) return <MainButton type={MainButtonType.InsufficientBalance} />;
    return (
      <MainButton
        type={MainButtonType.Swap}
        onClick={() => setConfirmModalOpen(true)}
        disabled={loadingQuote !== 'succeeded'}
      />
    );
  };

  // because we can manually update the quote, we need to check
  // that current update is really occurring after the specified delay
  useInterval(() => {
    const time = performance.now();
    if (time - lastQuoteUpdateTimestamp < REFRESH_QUOTE_DELAY_MS || loadingQuote === 'pending') return;
    updateQuote();
    update && update();
  }, 1000);

  useEffect(() => {
    updateQuote();
    update && update();
  }, [inputToken?.address, outputToken?.address, typedValue, referrerOptions, txFeeCalculation?.gasPriceInfo?.price]);

  const routeSteps = totalRouteSteps(protocols);

  return (
    <Box
      data-testid="widget-root"
      component="div"
      sx={{
        '::-webkit-scrollbar': {
          display: 'none',
        },
        position: 'relative',
        height: '537px',
        width: widgetWidth,
        '& ::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '& ::-webkit-scrollbar-track': {
          display: 'none',
          // backgroundColor: 'widget.bg-main',
        },
        '& ::-webkit-scrollbar-thumb': {
          display: 'none',
          // backgroundColor: 'widget.border-01',
          // borderRadius: '4px',
          // border: '2px solid',
          // borderColor: 'widget.bg-main',
        },
      }}>
      <Modal
        headerType={ModalHeaderType.Main}
        isOpen
        hide={isConfirmOpen || isSettingsOpen || isRouteOpen}
        openSettings={() => setSettingsOpen(true)}>
        <React.Fragment>
          <SendBox onSelectToken={() => setSelectTokenOpen({ field: Field.INPUT, open: true })} />
          <SwitchTokensButton />
          <GetBox onSelectToken={() => setSelectTokenOpen({ field: Field.OUTPUT, open: true })} />
        </React.Fragment>
        <RateSection openRoute={() => setRouteOpen(true)} totalRouteSteps={routeSteps} />
        {mainButtonByType()}
      </Modal>
      <SelectTokenModal
        field={isSelectTokenOpen.field}
        onClose={() => setSelectTokenOpen({ ...isSelectTokenOpen, open: false })}
        isOpen={isSelectTokenOpen.open}
        onOpenCustomToken={() => {
          setSelectTokenOpen({ ...isSelectTokenOpen, open: false });
          setAddTokenOpen(true);
        }}
      />
      <Modal
        headerType={ModalHeaderType.AdvancedSettings}
        isOpen={isSettingsOpen}
        goBack={() => setSettingsOpen(false)}
      />

      <SettingsModal
        onOpenAddCustomToken={() => setAddTokenOpen(true)}
        gasOptions={gasOptions}
        isOpen={isSettingsOpen}
        goBack={() => setSettingsOpen(false)}
      />
      <AddTokenModal field={isSelectTokenOpen.field} goBack={() => setAddTokenOpen(false)} isOpen={isAddTokenOpen} />
      <ConfirmSwapModal gasOptions={gasOptions} goBack={() => setConfirmModalOpen(false)} isOpen={isConfirmOpen} />
      <AlertModal open={shouldOpenModal()} onClose={clearMessage} text={errorMessage.text} title={errorMessage.title} />
      <RouteModal
        protocols={protocols}
        goBack={() => setRouteOpen(false)}
        isOpen={isRouteOpen}
        totalRouteSteps={routeSteps}
      />
      <ConnectionModal goBack={() => setConnectionOpen(false)} isOpen={isConnectionOpen} />
    </Box>
  );
}

export default Swap;
