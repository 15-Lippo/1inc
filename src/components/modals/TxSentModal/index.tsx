import { Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

import { MainnetChainId, networkConfigs } from '../../../constants';
import { useActiveWeb3React } from '../../../packages/web3-provider';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { cleanLastTxHash } from '../../../store/state/transactions/txSlice';
import { SupportedChainId } from '../../../types';
import { MainButton, MainButtonType } from '../../buttons';
import { SentArray } from '../../icons';
import { Modal, ModalHeaderType } from '../Modal';

const TxSentModal = () => {
  const { chainId } = useActiveWeb3React();
  const dispatch = useAppDispatch();
  const { INPUT, OUTPUT, txHash } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap.INPUT],
    OUTPUT: state.tokens.tokens[state.swap.OUTPUT],
    txHash: state.transactions.lastTxHash,
  }));
  const [explorer, setExplorer] = useState(networkConfigs[MainnetChainId]);

  useEffect(() => {
    if (chainId) {
      setExplorer(networkConfigs[chainId as SupportedChainId]);
    }
  }, [chainId]);

  const openExplorer = () => {
    window.open(`${explorer.blockExplorerUrls[0]}/tx/${txHash}`, '_blank');
  };

  const closeModal = () => {
    dispatch(cleanLastTxHash());
  };

  return (
    <Modal headerType={ModalHeaderType.Sent} isOpen={!!txHash} closeModal={closeModal}>
      <Stack direction="column" justifyContent="space-between" alignItems="center">
        <SentArray />
        <Typography
          sx={{
            color: 'widget.text-primary',
            mt: '52px',
          }}>
          <Trans i18nKey="Swap of" values={{ input: INPUT && INPUT.symbol, output: OUTPUT && OUTPUT.symbol }} />
        </Typography>
      </Stack>
      <Stack>
        <MainButton
          type={MainButtonType.Explorer}
          onClick={openExplorer}
          explorerName={explorer.explorerName}
          sx={{ mb: '8px' }}
        />
        <MainButton type={MainButtonType.Close} onClick={closeModal} />
      </Stack>
    </Modal>
  );
};

export default TxSentModal;
