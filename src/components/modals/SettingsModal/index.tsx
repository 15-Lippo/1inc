import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

import { LocalStorageKeys } from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setCustomGasPrice, setGasPriceInfo, setGasPriceSettingsMode } from '../../../store/state/swap/swapSlice';
import { formatGweiFixed } from '../../../utils';
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
  const { slippage, txFeeCalculation } = useAppSelector((state) => state.swap);
  const [isOpenCustomTokens, setOpenCustomTokens] = useState<boolean>(false);

  const countOfCustomTokens = () => {
    const existingTokens =
      // @ts-ignore
      JSON.parse(localStorage.getItem(LocalStorageKeys.imported_tokens)) ?? [];
    return Object.entries(existingTokens).length;
  };

  const gasPriceGweiCustom =
    Number(txFeeCalculation.customGasPrice.maxFee) && formatGweiFixed(txFeeCalculation.customGasPrice.maxFee);

  const onReset = () => {
    dispatch(setGasPriceSettingsMode('basic'));
    dispatch(setGasPriceInfo(gasOptions['high']));
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
                <ExpandMoreRoundedIcon
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
                    Gas price
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
                    ? `${txFeeCalculation.gasPriceInfo.label} (${txFeeCalculation.gasPriceInfo.range})`
                    : `Custom (${gasPriceGweiCustom} Gwei)`}
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
                <ExpandMoreRoundedIcon
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
                    Slippage tolerance
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
            <MenuItem onClick={() => setOpenCustomTokens(true)}>
              <ListItemIcon
                sx={{
                  '&:hover .MuiSvgIcon-root, &:hover #count-of-custom-tokens': {
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
                      Custom tokens
                    </Typography>
                  }
                />
                <Typography id="count-of-custom-tokens" color="widget.text-secondary" variant="rsm14">
                  {countOfCustomTokens()}
                </Typography>
                <ArrowForwardIosRoundedIcon sx={{ ml: '13px', color: 'widget.icon-02', id: 'arrow', fontSize: 16 }} />
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
