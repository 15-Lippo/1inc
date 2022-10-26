import { ArrowForwardIosRounded, ExpandMoreRounded } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  svgIconClasses,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import {
  setCustomGasPrice,
  setGasPriceInfo,
  setGasPriceSettingsMode,
  useAppDispatch,
  useAppSelector,
} from '../../../store';
import { SupportedGasOptions } from '../../../types';
import { formatGweiFixed } from '../../../utils';
import { countOfCustomTokens } from '../../../utils';
import { SlippageButtonsGroup } from '../../buttons';
import GasPriceOptions from '../../GasPriceOptions';
import { CustomTokensIcon, GasStation, SlippageWaves } from '../../icons';
import CustomTokensModal from '../CustomTokensModal';
import { Modal, ModalHeaderType } from '../Modal';

interface SettingsModalProps {
  isOpen: boolean;
  goBack: () => void;
  gasOptions: any;
  onOpenAddCustomToken: () => void;
}

const SettingsModal = ({ gasOptions, isOpen, goBack, onOpenAddCustomToken }: SettingsModalProps) => {
  const dispatch = useAppDispatch();
  const { chainId } = useWeb3React();
  const { t } = useTranslation();
  const { slippage, txFeeCalculation } = useAppSelector((state) => state.swap);
  const [isOpenCustomTokens, setOpenCustomTokens] = useState<boolean>(false);

  const gasPriceGweiCustom =
    Number(txFeeCalculation.customGasPrice.maxFee) && formatGweiFixed(txFeeCalculation.customGasPrice.maxFee);

  const onReset = () => {
    dispatch(setGasPriceSettingsMode('basic'));
    dispatch(setGasPriceInfo(gasOptions[SupportedGasOptions.High]));
    dispatch(
      setCustomGasPrice({
        label: '',
        maxFee: '0',
        maxPriorityFee: '0',
        timeLabel: '--/--',
        range: 'N/A',
      })
    );
  };

  return (
    <React.Fragment>
      <Modal headerType={ModalHeaderType.AdvancedSettings} isOpen={isOpen} goBack={goBack} onReset={onReset}>
        <Box
          sx={{
            overflow: 'auto',
            MsOverflowStyle: 'none' /* Internet Explorer 10+ */,
            scrollbarWidth: 'none',
          }}>
          <Accordion
            disableGutters
            elevation={0}
            defaultExpanded
            sx={{
              mt: '15px',
              '&:before': {
                display: 'none',
              },
            }}>
            <AccordionSummary
              expandIcon={
                <ExpandMoreRounded
                  sx={{
                    color: 'widget.icon-02',
                  }}
                />
              }
              aria-controls="panel1a-content"
              id="slippage-accordion">
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  mr: '5px',
                }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                  <GasStation />
                  <Typography
                    sx={{
                      color: 'widget.text-primary',
                      marginLeft: '5px',
                    }}
                    variant="sbm16">
                    <Trans>Gas price</Trans>
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    typography: 'rsm14',
                    color: 'widget.text-secondary',
                    marginLeft: '5px',
                  }}
                  variant="rm16">
                  {txFeeCalculation.gasPriceSettingsMode === 'basic'
                    ? `(${txFeeCalculation.gasPriceInfo.range})`
                    : t('Custom') + ` (${gasPriceGweiCustom} Gwei)`}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <GasPriceOptions gasOptions={gasOptions} />
            </AccordionDetails>
          </Accordion>
          <Accordion
            defaultExpanded
            elevation={0}
            sx={{
              mt: '15px',
              '&:before': {
                display: 'none',
              },
            }}>
            <AccordionSummary
              expandIcon={
                <ExpandMoreRounded
                  sx={{
                    color: 'widget.icon-02',
                  }}
                />
              }
              aria-controls="panel1a-content"
              id="slippage-accordion">
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  mr: '5px',
                }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                  <SlippageWaves />
                  <Typography
                    sx={{
                      color: 'widget.text-primary',
                      marginLeft: '5px',
                    }}
                    variant="sbm16">
                    <Trans>Slippage tolerance</Trans>
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    typography: 'rsm14',
                    color: 'widget.text-secondary',
                    marginLeft: '5px',
                  }}
                  variant="rm16">
                  {slippage}%
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <SlippageButtonsGroup />
            </AccordionDetails>
          </Accordion>
          <MenuList>
            <MenuItem
              sx={{
                p: 0,
                mt: '15px',
              }}
              onClick={() => setOpenCustomTokens(true)}>
              <ListItemIcon
                sx={{
                  [`&:hover .${svgIconClasses.root}, &:hover #count-of-custom-tokens`]: {
                    color: 'widget.text-primary',
                  },
                }}>
                <CustomTokensIcon />
                <ListItemText
                  sx={{
                    ml: '5px',
                  }}
                  primary={
                    <Typography variant="sbm16" color="widget.text-primary">
                      <Trans>Custom tokens</Trans>
                    </Typography>
                  }
                />
                <Typography id="count-of-custom-tokens" color="widget.text-secondary" variant="rsm14">
                  {countOfCustomTokens(chainId)}
                </Typography>
                <ArrowForwardIosRounded sx={{ ml: '13px', color: 'widget.icon-02', id: 'arrow', fontSize: 16 }} />
              </ListItemIcon>
            </MenuItem>
          </MenuList>
        </Box>
      </Modal>
      <CustomTokensModal
        onOpenAddCustomToken={onOpenAddCustomToken}
        isOpen={isOpenCustomTokens}
        goBack={() => setOpenCustomTokens(false)}
      />
    </React.Fragment>
  );
};

export default SettingsModal;
