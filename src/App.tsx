import './App.css';

import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';

import MainButton, { MainButtonType } from './components/Buttons/MainButton';
import ConfirmSwapModal from './components/ConfirmSwapModal';
import GetBox from './components/GetBox';
import Modal, { ModalHeaderType } from './components/Modal';
import SendBox from './components/SendBox';
import WalletConnect from './components/WalletConnect';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { ApproveStatus } from './store/state/approve/approveSlice';
import { useApproval } from './store/state/approve/hooks';
import { Field, selectCurrency } from './store/state/swap/swapSlice';
import { useTokens } from './store/state/tokens/useTokens';

export interface IWidgetProps {
  defaultInput: string;
  defaultOutput: string;
}

function App() {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const { addresses } = useTokens();
  const { status, approve } = useApproval();
  const { INPUT, OUTPUT } = useAppSelector((state) => state.swap);
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

  const onApprove = async () => {
    await approve();
  };
  return (
    <Modal headerType={ModalHeaderType.Main} isOpen>
      {addresses.length && (
        <>
          <SendBox />
          <GetBox />
          {status === ApproveStatus.APPROVAL_NEEDED && (
            <MainButton type={MainButtonType.Approve} onClick={onApprove} />
          )}
        </>
      )}
      {account ? (
        <MainButton
          type={MainButtonType.Swap}
          // disabled={!account || !typedValue}
          onClick={() => setConfirmModalOpen(true)}
        />
      ) : (
        <WalletConnect />
      )}
      <ConfirmSwapModal
        closeModal={() => setConfirmModalOpen(false)}
        isOpen={isConfirmModalModal}
      />
    </Modal>
  );
}

export default App;
