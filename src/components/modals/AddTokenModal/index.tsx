import { isAddress } from '@ethersproject/address';
import {
  Avatar,
  Box,
  Checkbox,
  checkboxClasses,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import ERC20ABI from '../../../abi/ERC20ABI';
import { LocalStorageKeys } from '../../../constants';
import { useActiveWeb3React } from '../../../packages/web3-provider';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectCurrency } from '../../../store/state/swap/swapSlice';
import { addTokenToAllTokens, fetchCoinInfoById, Token } from '../../../store/state/tokens/tokensSlice';
import { Field } from '../../../types';
import { getContract } from '../../../utils';
import { MainButton, MainButtonType } from '../../buttons';
import { NoLogoURI, WarningIcon } from '../../icons';
import VirtualizedTokenList from '../../VirtualizedTokenList';
import { Modal, ModalHeaderType } from '../Modal';

interface AddTokenModalProps {
  isOpen: boolean;
  goBack: () => void;
  field: Field;
}

const AddTokenModal = ({ isOpen, goBack, field }: AddTokenModalProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
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
              label: t('Import'),
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
          <Typography sx={{ m: '10px 16px' }} color="widget.text-successful" variant="rm16">
            <Trans>This token has already been added</Trans>
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
            border: `1px solid ${theme.palette.widget['border-01']}`,
            borderRadius: '16px',
            mb: '14px',
          }}>
          <Stack direction="row">
            <Avatar src={tokenToImport?.token?.logoURI} alt={tokenToImport?.token?.symbol}>
              <NoLogoURI />
            </Avatar>
            <Stack sx={{ ml: '16px' }} direction="column" justifyContent="space-between">
              <Typography color="widget.text-primary" variant="mm16">
                {tokenToImport?.token?.name}
              </Typography>
              <Typography color="widget.text-secondary" variant="rxs12">
                {tokenToImport?.token?.symbol}
              </Typography>
            </Stack>
          </Stack>
          <hr
            color={theme.palette.widget['border-01']}
            style={{
              margin: '19px 0',
              height: '1px',
              borderWidth: 0,
            }}
          />
          <Typography color="widget.text-primary" variant="rsm14">
            {tokenToImport?.token?.address}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'widget.bg-alert-error',
            p: '18px',
            borderRadius: '12px',
            mb: '30px',
          }}>
          <WarningIcon
            error={true}
            sx={{
              margin: '2px  18px 0 0',
            }}
          />
          <Stack direction="column" justifyContent="space-between">
            <Typography sx={{ mb: '14px' }} color="widget.text-error" variant="sblg18">
              <Trans>Trade at your own risk!</Trans>
            </Typography>
            <Typography sx={{ mb: '14px' }} color="widget.text-primary" variant="rsm14">
              <Trans>
                Anyone can create a token, including creating fake versions of existing tokens that claim to represent
                projects
              </Trans>
            </Typography>
            <Typography sx={{ mb: '14px' }} color="widget.text-primary" variant="rsm14">
              <Trans>If you purchase this token, you may not be able to sell it back</Trans>
            </Typography>
            <FormGroup>
              <FormControlLabel
                sx={{
                  color: 'widget.text-primary',
                }}
                control={
                  <Checkbox
                    inputProps={{ 'aria-label': 'controlled' }}
                    checked={understanding}
                    disableRipple
                    onChange={handleCheckboxChange}
                    sx={{
                      '&:hover': {
                        color: 'widget.checkbox-00',
                      },
                      paddingLeft: '0',
                      color: 'widget.checkbox-01',
                      borderRadius: 4,
                      [`& .${checkboxClasses.checked}`]: {
                        borderRadius: '4px',
                        color: 'widget.checkbox-00',
                      },
                    }}
                  />
                }
                label={<Trans>I understand</Trans>}
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
