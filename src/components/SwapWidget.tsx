import './SwapWidget.css';

import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import React, { useEffect, useState } from 'react';

import { REFRESH_QUOTE_DELAY_MS, SupportedChainId, Tokens } from '../constants';
import { SupportedGasOptions, useAlertMessage, useGasPriceOptions, useInterval, useLocalStorage } from '../hooks';
import { useActiveWeb3React } from '../packages/web3-provider';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { ApproveStatus } from '../store/state/approve/approveSlice';
import { useApproval } from '../store/state/approve/hooks';
import { useCalculateApprovalCost } from '../store/state/approve/useCalculateApprovalCost';
import { selectCurrency, setGasPriceInfo } from '../store/state/swap/swapSlice';
import { useUpdateQuote } from '../store/state/swap/useUpdateQuote';
import { useTokens } from '../store/state/tokens/useTokens';
import { setExplorer } from '../store/state/user/userSlice';
import { Field } from '../types';
import { MainButton, MainButtonType, SwitchTokensButton } from './buttons';
import GetBox from './GetBox';
import {
  AddTokenModal,
  AlertModal,
  ConfirmSwapModal,
  Modal,
  ModalHeaderType,
  SelectTokenModal,
  SettingsModal,
} from './modals';
import RateSection from './RateSection';
import SendBox from './SendBox';
import WalletConnect from './WalletConnect';

export type SwapWidgetProps = {
  width?: string | number;
};

function SwapWidget({ width }: SwapWidgetProps) {
  const dispatch = useAppDispatch();
  const { account, chainId } = useActiveWeb3React();
  const { gasOptions, blockNum } = useGasPriceOptions();
  const { addresses } = useTokens();
  const { status, approve } = useApproval();
  const gasPriceInfo = useAppSelector((state) => state.swap.txFeeCalculation?.gasPriceInfo);
  const {
    INPUT,
    OUTPUT,
    typedValue,
    tokensList,
    quoteError,
    approveTransactionInfo,
    txFee,
    referrerOptions,
    inputToken,
    outputToken,
    lastQuoteUpdateTimestamp,
  } = useAppSelector((state) => ({
    quoteError: state.swap.quoteError,
    INPUT: state.swap.INPUT,
    OUTPUT: state.swap.OUTPUT,
    typedValue: state.swap.typedValue,
    tokensList: state.tokens.tokens,
    lastTxHash: state.transactions.lastTxHash,
    approveTransactionInfo: state.approve.approveTransactionInfo,
    txFee: state.swap.txFeeCalculation.txFee,
    referrerOptions: state.swap.referrerOptions,
    inputToken: state.tokens.tokens[state.swap[Field.INPUT]] || {},
    outputToken: state.tokens.tokens[state.swap[Field.OUTPUT]] || {},
    lastQuoteUpdateTimestamp: state.swap.lastQuoteUpdateTimestamp,
  }));
  const [, setFavoriteTokens] = useLocalStorage('favorite-tokens', Tokens.FAVORITE_TOKENS);
  const { approvalTxFee, estimateGasLimit: estimateApprovalCost } = useCalculateApprovalCost();

  const [isConfirmOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [isAddTokenOpen, setAddTokenOpen] = useState<boolean>(false);
  const [isSelectTokenOpen, setSelectTokenOpen] = useState({
    field: Field.INPUT,
    open: false,
  });
  const { errorMessage, setErrorMessage, shouldOpenModal, clearMessage } = useAlertMessage();
  const updateQuote = useUpdateQuote();

  useEffect(() => {
    // Set default high gas price option:
    if (gasPriceInfo?.price === '0' || !gasPriceInfo?.price) {
      dispatch(setGasPriceInfo(gasOptions[SupportedGasOptions.High]));
    }
  }, [gasOptions, blockNum]);

  useEffect(() => {
    const setDefaultTokens = () => {
      if (Tokens.DEFAULT_TOKENS[Field.INPUT])
        dispatch(selectCurrency({ currency: Tokens.DEFAULT_TOKENS[Field.INPUT], field: Field.INPUT }));
      if (Tokens.DEFAULT_TOKENS[Field.OUTPUT])
        dispatch(selectCurrency({ currency: Tokens.DEFAULT_TOKENS[Field.OUTPUT], field: Field.OUTPUT }));
    };

    if (!addresses.length) return;
    if (INPUT && OUTPUT) return;
    console.log('set default tokens ...');
    setDefaultTokens();
  }, [addresses.length, INPUT, OUTPUT]);

  useEffect(() => {
    if (!localStorage.getItem('favorite-tokens')) setFavoriteTokens(Tokens.FAVORITE_TOKENS);
    dispatch(setExplorer({ chainId: chainId || SupportedChainId.MAINNET }));
  }, [chainId]);

  const hasEnoughBalanceByAddress = (paymentCost: BigNumberish, tokenAddress: string): boolean => {
    const balance = tokensList[tokenAddress].userBalance || '0';
    return BigNumber.from(paymentCost).lte(balance);
  };

  useEffect(() => {
    estimateApprovalCost();
  }, [approveTransactionInfo.data]);

  const handleApproveClick = () => {
    if (!hasEnoughBalanceByAddress(approvalTxFee, Tokens.DEFAULT_TOKENS[Field.INPUT])) {
      setErrorMessage({
        text: 'Insufficient balance to pay for gas',
        title: 'Alert',
      });
      return;
    }
    approve();
  };

  const hasEnoughNativeTokenBalanceToSwap = () => {
    let paymentCost = BigNumber.from(txFee);
    if (INPUT === Tokens.DEFAULT_TOKENS[Field.INPUT]) {
      paymentCost = paymentCost.add(typedValue);
    }
    return hasEnoughBalanceByAddress(paymentCost, Tokens.DEFAULT_TOKENS[Field.INPUT]);
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
  }, [inputToken?.address, outputToken?.address, typedValue, chainId, account, referrerOptions]);

  return (
    <div style={{ position: 'relative', height: 'inherit', width }}>
      <Modal
        headerType={ModalHeaderType.Main}
        isOpen
        hide={isConfirmOpen || isSettingsOpen}
        openSettings={() => setSettingsOpen(true)}>
        <React.Fragment>
          <SendBox onSelectToken={() => setSelectTokenOpen({ field: Field.INPUT, open: true })} />
          <SwitchTokensButton />
          <GetBox onSelectToken={() => setSelectTokenOpen({ field: Field.OUTPUT, open: true })} />
        </React.Fragment>
        <RateSection />
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
    </div>
  );
}

export default SwapWidget;
