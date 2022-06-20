import { Stack, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';

import { EXPLORER_LINKS } from '../../constants';
import { SupportedChainId } from '../../constants/chains';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { cleanLastTxHash } from '../../store/state/transactions/txSlice';
import MainButton, { MainButtonType } from '../Buttons/MainButton';
import { SentArray } from '../icons/SentArray';
import Modal, { ModalHeaderType } from '../Modal';

const TxSentModal = () => {
  const { chainId } = useWeb3React();
  const dispatch = useAppDispatch();
  const { INPUT, OUTPUT, txHash } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap.INPUT],
    OUTPUT: state.tokens.tokens[state.swap.OUTPUT],
    txHash: state.transactions.lastTxHash,
  }));
  const [explorer, setExplorer] = useState(EXPLORER_LINKS[SupportedChainId.MAINNET]);

  useEffect(() => {
    if (chainId) {
      const exp = EXPLORER_LINKS[chainId as SupportedChainId];
      setExplorer(exp);
    }
  }, [chainId]);

  const openExplorer = () => {
    window.open(`${explorer.link}/tx/${txHash}`, '_blank');
  };

  const closeModal = () => {
    dispatch(cleanLastTxHash());
  };

  return (
    <Modal headerType={ModalHeaderType.Sent} isOpen={!!txHash} closeModal={closeModal}>
      <Stack direction="column" justifyContent="space-between" alignItems="center">
        {SentArray}
        <Typography
          sx={{
            mt: '52px',
          }}>
          Swap of {INPUT && INPUT.symbol} to {OUTPUT && OUTPUT.symbol}
        </Typography>
      </Stack>
      <Stack>
        <MainButton
          type={MainButtonType.Explorer}
          onClick={openExplorer}
          explorerName={explorer.name}
          sx={{
            mb: '8px',
          }}
        />
        <MainButton type={MainButtonType.Close} onClick={closeModal} />
      </Stack>
    </Modal>
  );
};

export default TxSentModal;
