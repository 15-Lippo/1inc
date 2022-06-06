import './App.css';

import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';

import MainButton, { MainButtonType } from './components/Buttons/MainButton';
import SwitchTokensButton from './components/Buttons/SwitchTokensButton';
import ConfirmSwapModal from './components/ConfirmSwapModal';
import GetBox from './components/GetBox';
import Modal, { ModalHeaderType } from './components/Modal';
import RateSection from './components/RateSection';
import SendBox from './components/SendBox';
import WalletConnect from './components/WalletConnect';
import { SupportedChainId } from './constants/chains';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { ApproveStatus } from './store/state/approve/approveSlice';
import { useApproval } from './store/state/approve/hooks';
import { Field, selectCurrency } from './store/state/swap/swapSlice';
import { useTokens } from './store/state/tokens/useTokens';
import { setExplorer } from './store/state/user/userSlice';

export interface IWidgetProps {
  defaultInput: string;
  defaultOutput: string;
}

function App() {
  const dispatch = useAppDispatch();
  const { account, chainId } = useWeb3React();
  const { addresses } = useTokens();
  const { status, approve } = useApproval();
  const { INPUT, OUTPUT, typedValue, tokensList } = useAppSelector((state) => ({
    INPUT: state.swap.INPUT,
    OUTPUT: state.swap.OUTPUT,
    typedValue: state.swap.typedValue,
    tokensList: state.tokens.tokens,
    lastTxHash: state.transactions.lastTxHash,
  }));

  const [isConfirmModalModal, setConfirmModalOpen] = useState<boolean>(false);

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
    dispatch(setExplorer({ chainId: chainId || SupportedChainId.MAINNET }));
  }, [chainId]);

  const mainButtonByType = () => {
    const balance = tokensList[INPUT]?.userBalance || '0';

    if (!account) return <WalletConnect />;
    if (!Number(typedValue)) return <MainButton type={MainButtonType.EnterAmount} />;
    if (status === ApproveStatus.APPROVAL_NEEDED)
      return <MainButton type={MainButtonType.Approve} onClick={approve} />;
    if (Number(typedValue) > Number(balance))
      return <MainButton type={MainButtonType.InsufficientBalance} />;
    return <MainButton type={MainButtonType.Swap} onClick={() => setConfirmModalOpen(true)} />;
  };

  return (
    <>
      <Modal headerType={ModalHeaderType.Main} isOpen hide={isConfirmModalModal}>
        <SendBox />
        <SwitchTokensButton />
        <GetBox />
        <RateSection />
        {mainButtonByType()}
      </Modal>
      <ConfirmSwapModal goBack={() => setConfirmModalOpen(false)} isOpen={isConfirmModalModal} />
    </>
  );
}

export default App;
