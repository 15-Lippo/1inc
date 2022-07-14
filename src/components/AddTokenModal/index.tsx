import { isAddress } from '@ethersproject/address';
import { Avatar, Box, Checkbox, FormControlLabel, FormGroup, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import ERC20ABI from '../../abi/ERC20ABI.json';
import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectCurrency } from '../../store/state/swap/swapSlice';
import { addTokenToAllTokens, fetchCoinInfoById, Token } from '../../store/state/tokens/tokensSlice';
import { Field } from '../../types';
import { getContract } from '../../utils/contract';
import { LocalStorageKeys } from '../../utils/localStorageKeys';
import MainButton, { MainButtonType } from '../Buttons/MainButton';
import NoLogoURI from '../icons/NoLogoURI';
import { Modal, ModalHeaderType } from '../Modal';
import VirtualizedTokenList from '../VirtualizedTokenList';

interface AddTokenModalProps {
  isOpen: boolean;
  goBack: () => void;
  field: Field;
}

const AddTokenModal = ({ isOpen, goBack, field }: AddTokenModalProps) => {
  const dispatch = useAppDispatch();
  const { library } = useActiveWeb3React();
  const { lastImportedTokenInfo } = useAppSelector((state) => state.tokens);
  const { tokens } = useAppSelector((state) => state.tokens);

  const [tokenToImport, setTokenToImport] = useState({
    open: false,
    token: {} as Token,
  });
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchToken, setSearchToken] = useState<Token | null>();
  const [understanding, setUnderstanding] = useState<boolean>(false);

  const findTokenData = async () => {
    setSearchLoading(true);

    const existingTokens = Object.values(
      JSON.parse(localStorage.getItem(LocalStorageKeys.imported_tokens) as string) ?? {}
    );
    const filteredData = [...existingTokens, ...Object.values(tokens)].filter((item: any) => {
      return searchInput.toLowerCase() === item.address.toLowerCase();
    });
    if (filteredData.length) {
      // @ts-ignore
      setSearchToken(filteredData[0]);
      setSearchLoading(false);
    } else {
      const isValidAddress = isAddress(searchInput);

      if (isValidAddress && library) {
        try {
          const erc20Contract = await getContract(searchInput, ERC20ABI, library);
          const coinName = await erc20Contract.name();

          await dispatch(fetchCoinInfoById(coinName));

          const token = {
            address: searchInput,
            decimals: await erc20Contract.decimals(),
            logoURI: '',
            name: coinName,
            symbol: await erc20Contract.symbol(),
            button: {
              label: 'Import',
              handleClick: (token: Token) => {
                setTokenToImport({
                  open: true,
                  token,
                });
              },
            },
          };
          setSearchToken(token);
          setSearchLoading(false);
        } catch (e) {
          // @ts-ignore
          console.error('Search token:', e.message);
          setSearchLoading(false);
          return null;
        }
      }
      setSearchLoading(false);
      return null;
    }
    return null;
  };

  useEffect(() => {
    findTokenData();
  }, [searchInput]);

  useEffect(() => {
    // add logoURI key to imported token
    if (searchToken?.address && !searchToken.logoURI)
      setSearchToken({ ...searchToken, logoURI: lastImportedTokenInfo?.image });
  }, [searchInput, searchToken?.address, lastImportedTokenInfo?.image]);

  const onSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!value) {
      setSearchToken(null);
    }
    setSearchInput(value);
  };

  const handleCheckboxChange = () => {
    setUnderstanding(!understanding);
  };

  const onChoose = (address: string) => {
    dispatch(
      selectCurrency({
        currency: address,
        field,
      })
    );
    closeAddTokenModal();
  };

  const importToken = async () => {
    // button for import is no needed in the main token list
    if (tokenToImport.token.button) delete tokenToImport.token.button;
    // @ts-ignore
    const existingTokens = JSON.parse(localStorage.getItem(LocalStorageKeys.imported_tokens)) ?? [];
    localStorage.setItem(
      LocalStorageKeys.imported_tokens,
      JSON.stringify({ ...existingTokens, [tokenToImport.token.address]: tokenToImport.token })
    );

    dispatch(addTokenToAllTokens(tokenToImport.token));
    closeImportConfirmationModal();
    onChoose(tokenToImport.token.address);
  };

  const closeImportConfirmationModal = () => {
    return setTokenToImport({ open: false, token: {} as Token });
  };

  const closeAddTokenModal = () => {
    setSearchInput('');
    setSearchToken(null);
    goBack();
  };

  return (
    <React.Fragment>
      <Modal
        onSearch={onSearch}
        searchValue={searchInput}
        headerType={ModalHeaderType.AddToken}
        goBack={closeAddTokenModal}
        isOpen={isOpen}>
        {searchToken?.address && !searchToken?.button && (
          <Typography sx={{ m: '10px 16px' }} color="green.500" variant="rm16">
            This token has already been added
          </Typography>
        )}
        <VirtualizedTokenList
          onChoose={onChoose}
          loading={searchLoading}
          tokensList={searchToken?.address ? [searchToken] : []}
        />
      </Modal>
      <Modal headerType={ModalHeaderType.Import} isOpen={tokenToImport.open} goBack={closeImportConfirmationModal}>
        <Box
          sx={{
            p: '18px',
            boxSizing: 'border-box',
            border: ' 1px solid #E3E7EE',
            borderRadius: '16px',
            mb: '14px',
          }}>
          <Stack direction="row">
            {tokenToImport?.token?.logoURI ? (
              <Avatar src={tokenToImport?.token?.logoURI} alt={tokenToImport?.token?.symbol} />
            ) : (
              <NoLogoURI />
            )}
            <Stack sx={{ ml: '16px' }} direction="column" justifyContent="space-between">
              <Typography color="dark.900" variant="mm16">
                {tokenToImport?.token?.name}
              </Typography>
              <Typography color="dark.700" variant="rxs12">
                {tokenToImport?.token?.symbol}
              </Typography>
            </Stack>
          </Stack>
          <hr
            color="#E3E7EE"
            style={{
              margin: '19px 0',
              height: '1px',
              borderWidth: 0,
            }}
          />
          <Typography variant="rsm14">{tokenToImport?.token?.address}</Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: 'red.16',
            p: '18px',
            borderRadius: '12px',
            mb: '30px',
          }}>
          <Stack direction="column" justifyContent="space-between">
            <Typography sx={{ mb: '14px' }} color="red.500" variant="sblg18">
              Trade at your own risk!
            </Typography>
            <Typography sx={{ mb: '14px' }} variant="rsm14">
              Anyone can create a token, including creating fake versions of existing tokens that claim to represent
              projects
            </Typography>
            <Typography sx={{ mb: '14px' }} variant="rsm14">
              If you purchase this token, you may not be able to sell it back
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    inputProps={{ 'aria-label': 'controlled' }}
                    checked={understanding}
                    onChange={handleCheckboxChange}
                  />
                }
                label="I understand"
              />
            </FormGroup>
          </Stack>
        </Box>
        <MainButton disabled={!understanding} type={MainButtonType.Import} onClick={importToken} />
      </Modal>
    </React.Fragment>
  );
};

export default AddTokenModal;
