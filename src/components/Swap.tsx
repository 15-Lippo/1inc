import './Swap.css';

import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { Box } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { REFRESH_QUOTE_DELAY_MS, Tokens } from '../constants';
import { SupportedGasOptions, useAlertMessage, useGasPriceOptions, useInterval } from '../hooks';
import { useActiveWeb3React } from '../packages/web3-provider';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { ApproveStatus } from '../store/state/approve/approveSlice';
import { useApproval } from '../store/state/approve/hooks';
import { useCalculateApprovalCost } from '../store/state/approve/useCalculateApprovalCost';
import { applyDefaultSettings, setGasPriceInfo } from '../store/state/swap/swapSlice';
import { useUpdateQuote } from '../store/state/swap/useUpdateQuote';
import { useTokens } from '../store/state/tokens/useTokens';
import { cleanLastTxHash } from '../store/state/transactions/txSlice';
import { setExplorer } from '../store/state/user/userSlice';
import { Field } from '../types';
import { totalRouteSteps } from '../utils';
import { MainButton, MainButtonType, SwitchTokensButton } from './buttons';
import GetBox from './GetBox';
import {
  AddTokenModal,
  AlertModal,
  ConfirmSwapModal,
  Modal,
  ModalHeaderType,
  RouteModal,
  SelectTokenModal,
  SettingsModal,
} from './modals';
import RateSection from './RateSection';
import SendBox from './SendBox';
import WalletConnect from './WalletConnect';

export type SwapProps = {
  width?: string | number;
};

function Swap({ width }: SwapProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { account, chainId } = useActiveWeb3React();
  const { gasOptions, blockNum } = useGasPriceOptions();
  const { status, approve } = useApproval();
  useTokens();
  const gasPriceInfo = useAppSelector((state) => state.swap.txFeeCalculation?.gasPriceInfo);
  const {
    INPUT,
    typedValue,
    protocols,
    tokensList,
    quoteError,
    approveTransactionInfo,
    referrerOptions,
    inputToken,
    outputToken,
    txFeeCalculation,
    lastQuoteUpdateTimestamp,
  } = useAppSelector((state) => ({
    quoteError: state.swap.quoteError,
    INPUT: state.swap.INPUT,
    // OUTPUT: state.swap.OUTPUT,
    typedValue: state.swap.typedValue,
    protocols: state.swap.quoteInfo?.protocols,
    tokensList: state.tokens.tokens,
    // lastTxHash: state.transactions.lastTxHash,
    approveTransactionInfo: state.approve.approveTransactionInfo,
    referrerOptions: state.swap.referrerOptions,
    inputToken: state.tokens.tokens[state.swap[Field.INPUT]] || {},
    outputToken: state.tokens.tokens[state.swap[Field.OUTPUT]] || {},
    lastQuoteUpdateTimestamp: state.swap.lastQuoteUpdateTimestamp,
    txFeeCalculation: state.swap.txFeeCalculation,
  }));
  const { approvalTxFee, estimateGasLimit: estimateApprovalCost } = useCalculateApprovalCost();

  const [isConfirmOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [isAddTokenOpen, setAddTokenOpen] = useState<boolean>(false);
  const [isRouteOpen, setRouteOpen] = useState<boolean>(false);
  const [isSelectTokenOpen, setSelectTokenOpen] = useState({
    field: Field.INPUT,
    open: false,
  });
  const { errorMessage, setErrorMessage, shouldOpenModal, clearMessage } = useAlertMessage();
  const updateQuote = useUpdateQuote();

  const widgetWidth = useMemo(() => {
    if (width && width < 400) {
      console.warn(`Widget width must be at least 300px (you set it to ${width}). Falling back to 400px.`);
      return 400;
    }
    return width ?? 400;
  }, [width]);

  useEffect(() => {
    dispatch(cleanLastTxHash());
    // Set default high gas price option:
    if (gasPriceInfo?.price === '0' || !gasPriceInfo?.price) {
      dispatch(setGasPriceInfo(gasOptions[SupportedGasOptions.High]));
    }
  }, [gasOptions, blockNum, chainId]);

  useEffect(() => {
    if (chainId) {
      dispatch(setExplorer({ chainId }));
      dispatch(applyDefaultSettings({ chainId }));
    }
  }, [chainId]);

  const hasEnoughBalanceByAddress = (paymentCost: BigNumberish, tokenAddress: string): boolean => {
    const balance = tokensList[tokenAddress]?.userBalance || '0';
    return BigNumber.from(paymentCost).lte(balance);
  };

  useEffect(() => {
    estimateApprovalCost();
  }, [approveTransactionInfo.data]);

  const handleApproveClick = () => {
    if (!hasEnoughBalanceByAddress(approvalTxFee, Tokens.NATIVE_TOKEN_ADDRESS)) {
      setErrorMessage({
        text: t('Insufficient balance to pay for gas'),
        title: t('Alert'),
      });
      return;
    }
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
    if (!account) return <WalletConnect />;
    if (!Number(typedValue)) return <MainButton type={MainButtonType.EnterAmount} />;
    if (quoteError && account) return <MainButton type={MainButtonType.Error} />;
    if (status === ApproveStatus.APPROVAL_NEEDED)
      return <MainButton type={MainButtonType.Approve} onClick={handleApproveClick} />;
    if (!hasEnoughBalanceByAddress(typedValue, INPUT)) return <MainButton type={MainButtonType.InsufficientBalance} />;
    if (!hasEnoughNativeTokenBalanceToSwap())
      return <MainButton type={MainButtonType.InsufficientNativeTokenBalance} />;
    return <MainButton type={MainButtonType.Swap} onClick={() => setConfirmModalOpen(true)} />;
  };

  // because we can manually update the quote, we need to check
  // that current update is really occurring after the specified delay
  useInterval(() => {
    const time = performance.now();
    if (time - lastQuoteUpdateTimestamp >= REFRESH_QUOTE_DELAY_MS) {
      updateQuote();
    }
  }, 1000);

  useEffect(() => {
    updateQuote();
  }, [inputToken?.address, outputToken?.address, typedValue, referrerOptions, txFeeCalculation?.gasPriceInfo?.price]);

  const routeSteps = totalRouteSteps(protocols);

  return (
    <Box
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
    </Box>
  );
}

export default Swap;
