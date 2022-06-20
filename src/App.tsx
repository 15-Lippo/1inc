import './App.css';

import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';

import AddTokenModal from './components/AddTokenModal';
import MainButton, { MainButtonType } from './components/Buttons/MainButton';
import SwitchTokensButton from './components/Buttons/SwitchTokensButton';
import ConfirmSwapModal from './components/ConfirmSwapModal';
import GetBox from './components/GetBox';
import Modal, { ModalHeaderType } from './components/Modal';
import RateSection from './components/RateSection';
import SelectTokenModal from './components/SelectTokenModal';
import SendBox from './components/SendBox';
import SettingsModal from './components/SettingsModal';
import WalletConnect from './components/WalletConnect';
import { FAVORITE_TOKENS } from './constants';
import { SupportedChainId } from './constants/chains';
import { SupportedGasOptions, useGasPriceOptions } from './hooks/useGasPriceOptions';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { ApproveStatus } from './store/state/approve/approveSlice';
import { useApproval } from './store/state/approve/hooks';
import { Field, selectCurrency, setGasPriceInfo } from './store/state/swap/swapSlice';
import { useTokens } from './store/state/tokens/useTokens';
import { setExplorer } from './store/state/user/userSlice';

export interface IWidgetProps {
  defaultInput: string;
  defaultOutput: string;
}

function App() {
  const dispatch = useAppDispatch();
  const { account, chainId } = useWeb3React();
  const { gasOptions, blockNum } = useGasPriceOptions();
  const { addresses } = useTokens();
  const { status, approve } = useApproval();
  const gasPriceInfo = useAppSelector((state) => state.swap.txFeeCalculation?.gasPriceInfo);
  const { INPUT, OUTPUT, typedValue, tokensList, quoteError } = useAppSelector((state) => ({
    quoteError: state.swap.quoteError,
    INPUT: state.swap.INPUT,
    OUTPUT: state.swap.OUTPUT,
    typedValue: state.swap.typedValue,
    tokensList: state.tokens.tokens,
    lastTxHash: state.transactions.lastTxHash,
  }));
  const [, setFavoriteTokens] = useLocalStorage('favorite-tokens', FAVORITE_TOKENS);

  const [isConfirmOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [isAddTokenOpen, setAddTokenOpen] = useState<boolean>(false);
  const [isSelectTokenOpen, setSelectTokenOpen] = useState({
    field: Field.INPUT,
    open: false,
  });

  useEffect(() => {
    // Set default high gas price option:
    if (gasPriceInfo?.price === '0' || !gasPriceInfo?.price) {
      dispatch(setGasPriceInfo(gasOptions[SupportedGasOptions.High]));
    }
  }, [gasOptions, blockNum]);

  useEffect(() => {
    const setDefaultTokens = () => {
      const input = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
      const output = '0x111111111117dc0aa78b770fa6a738034120c302';

      if (input) dispatch(selectCurrency({ currency: input, field: Field.INPUT }));
      if (output) dispatch(selectCurrency({ currency: output, field: Field.OUTPUT }));
    };

    if (!addresses.length) return;
    if (INPUT && OUTPUT) return;
    console.log('set default tokens ...');
    setDefaultTokens();
  }, [addresses.length, INPUT, OUTPUT]);

  useEffect(() => {
    if (!localStorage.getItem('favorite-tokens')) setFavoriteTokens(FAVORITE_TOKENS);
    dispatch(setExplorer({ chainId: chainId || SupportedChainId.MAINNET }));
  }, [chainId]);

  const mainButtonByType = () => {
    const balance = tokensList[INPUT]?.userBalance || '0';

    if (!account) return <WalletConnect />;
    if (!Number(typedValue)) return <MainButton type={MainButtonType.EnterAmount} />;
    if (quoteError && account) return <MainButton type={MainButtonType.Error} />;
    if (status === ApproveStatus.APPROVAL_NEEDED)
      return <MainButton type={MainButtonType.Approve} onClick={approve} />;
    if (Number(typedValue) > Number(balance))
      return <MainButton type={MainButtonType.InsufficientBalance} />;
    return <MainButton type={MainButtonType.Swap} onClick={() => setConfirmModalOpen(true)} />;
  };

  return (
    <>
      <Modal
        headerType={ModalHeaderType.Main}
        isOpen
        hide={isConfirmOpen || isSettingsOpen}
        openSettings={() => setSettingsOpen(true)}>
        <>
          <SendBox onSelectToken={() => setSelectTokenOpen({ field: Field.INPUT, open: true })} />
          <SwitchTokensButton />
          <GetBox onSelectToken={() => setSelectTokenOpen({ field: Field.OUTPUT, open: true })} />
        </>
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
      <AddTokenModal
        field={isSelectTokenOpen.field}
        goBack={() => setAddTokenOpen(false)}
        isOpen={isAddTokenOpen}
      />
      <Modal
        headerType={ModalHeaderType.AdvancedSettings}
        isOpen={isSettingsOpen}
        goBack={() => setSettingsOpen(false)}
      />
      <SettingsModal
        gasOptions={gasOptions}
        isOpen={isSettingsOpen}
        goBack={() => setSettingsOpen(false)}
      />
      <ConfirmSwapModal goBack={() => setConfirmModalOpen(false)} isOpen={isConfirmOpen} />
    </>
  );
}

export default App;
