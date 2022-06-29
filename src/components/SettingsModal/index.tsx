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

import { useAppSelector } from '../../store/hooks';
import { LocalStorageKeys } from '../../utils/localStorageKeys';
import { SlippageButtonsGroup } from '../Buttons/SlippageButtonsGroup';
import CustomTokensModal from '../CustomTokensModal';
import CustomTokensIcon from '../icons/CustomTokensIcon';
import GasStation from '../icons/GasStation';
import SlippageWaves from '../icons/SlippageWaves';
import { Modal, ModalHeaderType } from '../Modal';
import SettingsMode from '../SettingsMode';
import UseRadioGroup from '../UseRadioGroup';

interface SettingsModalProps {
  isOpen: boolean;
  goBack: () => void;
  gasOptions: any;
  onOpenAddCustomToken: () => void;
}

const SettingsModal = ({ gasOptions, isOpen, goBack, onOpenAddCustomToken }: SettingsModalProps) => {
  const { slippage } = useAppSelector((state) => state.swap);
  const [mode, setMode] = useState<'basic' | 'advanced'>('basic');
  const [isOpenCustomTokens, setOpenCustomTokens] = useState<boolean>(false);

  const handleChangeMode = (_event: React.MouseEvent<HTMLElement>, newMode: 'basic' | 'advanced') => {
    setMode(newMode);
  };

  const countOfCustomTokens = () => {
    const existingTokens =
      // @ts-ignore
      JSON.parse(localStorage.getItem(LocalStorageKeys.imported_tokens)) ?? [];
    return Object.entries(existingTokens).length;
  };

  return (
    <React.Fragment>
      <Modal headerType={ModalHeaderType.AdvancedSettings} isOpen={isOpen} goBack={goBack}>
        <Box
          sx={{
            overflow: 'scroll',
            MsOverflowStyle: 'none' /* Internet Explorer 10+ */,
            scrollbarWidth: 'none',
          }}>
          <Accordion
            defaultExpanded
            sx={{
              mt: '15px',
            }}>
            <AccordionSummary
              expandIcon={<ExpandMoreRoundedIcon />}
              aria-controls="panel1a-content"
              id="slippage-accordion">
              <React.Fragment>
                <GasStation />
                <Typography
                  sx={{
                    marginLeft: '5px',
                  }}
                  variant="sbm16">
                  Gas price
                </Typography>
              </React.Fragment>
            </AccordionSummary>
            <AccordionDetails>
              <SettingsMode mode={mode} handleChangeMode={handleChangeMode} />
              {mode === 'basic' ? <UseRadioGroup gasOptions={gasOptions} /> : null}
            </AccordionDetails>
          </Accordion>
          <Accordion
            defaultExpanded
            sx={{
              mt: '15px',
            }}>
            <AccordionSummary
              expandIcon={<ExpandMoreRoundedIcon />}
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
                      marginLeft: '5px',
                    }}
                    variant="sbm16">
                    Slippage tolerance
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    typography: 'rsm14',
                    color: 'dark.700',
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
                    color: 'dark.900',
                  },
                }}>
                <CustomTokensIcon />
                <ListItemText
                  sx={{
                    ml: '5px',
                  }}
                  primary={
                    <Typography variant="sbm16" color="dark.900">
                      Custom tokens
                    </Typography>
                  }
                />
                <Typography id="count-of-custom-tokens" color="dark.700" variant="rsm14">
                  {countOfCustomTokens()}
                </Typography>
                <ArrowForwardIosRoundedIcon sx={{ ml: '13px', color: 'dark.700', id: 'arrow', fontSize: 16 }} />
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
