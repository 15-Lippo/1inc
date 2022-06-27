import { Box } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';

import { DEFAULT_TOKENS } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Field, selectCurrency } from '../../store/state/swap/swapSlice';
import { removeTokenFromAllTokens } from '../../store/state/tokens/tokensSlice';
import { Token } from '../../store/state/tokens/tokensSlice';
import { LocalStorageKeys } from '../../utils/localStorageKeys';
import AddToken from '../Buttons/AddToken';
import Modal, { ModalHeaderType } from '../Modal';
import VirtualizedTokenList from '../VirtualizedTokenList';

interface CustomTokensModalProps {
  isOpen: boolean;
  goBack: () => void;
  onOpenAddCustomToken: () => void;
}

const CustomTokensModal = ({ isOpen, goBack, onOpenAddCustomToken }: CustomTokensModalProps) => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const [customTokens, setCustomTokens] = useState({});
  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredResults, setFilteredResults] = useState<Token[]>([]);

  const { allTokens, INPUT_ADDRESS, OUTPUT_ADDRESS } = useAppSelector((state) => ({
    allTokens: Object.values(state.tokens.tokens),
    INPUT_ADDRESS: state.swap.INPUT,
    OUTPUT_ADDRESS: state.swap.OUTPUT,
  }));

  const tokensList = Object.values(customTokens) as Token[];

  useEffect(() => {
    const existingTokens =
      JSON.parse(localStorage.getItem(LocalStorageKeys.imported_tokens) as string) ?? {};
    setCustomTokens(existingTokens);
  }, [allTokens.length]);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
    const filteredData = tokensList.filter((item) => {
      return (
        item.name.toLowerCase().startsWith(value.toLowerCase()) ||
        item.symbol.toLowerCase().startsWith(value.toLowerCase())
      );
    });
    setFilteredResults(filteredData);
  };

  const onRemoveCustomToken = (address: string) => {
    // remove token from the local storage:
    // @ts-ignore
    delete customTokens[address];
    localStorage.setItem(LocalStorageKeys.imported_tokens, JSON.stringify({ ...customTokens }));

    // remove token from  main token list
    dispatch(removeTokenFromAllTokens(address));

    // update selected tokens after removing
    if (INPUT_ADDRESS.toLowerCase() === address.toLowerCase())
      dispatch(
        selectCurrency({
          currency: DEFAULT_TOKENS[Field.INPUT],
          field: Field.INPUT,
        })
      );
    if (OUTPUT_ADDRESS.toLowerCase() === address.toLowerCase())
      dispatch(
        selectCurrency({
          currency: DEFAULT_TOKENS[Field.OUTPUT],
          field: Field.OUTPUT,
        })
      );
  };

  return (
    <Modal
      onSearch={onSearch}
      searchValue={searchValue}
      headerType={ModalHeaderType.Custom}
      isOpen={isOpen}
      goBack={goBack}>
      <VirtualizedTokenList
        onRemoveCustomToken={onRemoveCustomToken}
        tokensList={!searchValue ? tokensList : filteredResults}
      />
      <Box
        sx={{
          width: 'inherit',
          position: 'absolute',
          left: '50%',
          bottom: -5,
          transform: 'translate(-50%, -50%)',
        }}>
        <hr
          color="#E3E7EE"
          style={{
            margin: 0,
            height: '1px',
            borderWidth: 0,
          }}
        />
        <AddToken
          walletIsConnected={!!account}
          onClick={() => {
            setSearchValue('');
            onOpenAddCustomToken();
          }}
        />
      </Box>
    </Modal>
  );
};

export default CustomTokensModal;
