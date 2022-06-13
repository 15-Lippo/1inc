import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Paper,
  ToggleButton,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

import { useAppSelector } from '../../store/hooks';
import { SlippageButtonsGroup, StyledToggleButtonGroup } from '../Buttons/SlippageButtonsGroup';
import GasStation from '../icons/GasStation';
import SlippageWaves from '../icons/SlippageWaves';
import Modal, { ModalHeaderType } from '../Modal';
import UseRadioGroup from '../UseRadioGroup';

interface SettingsModalProps {
  isOpen: boolean;
  goBack: () => void;
  gasOptions: any;
}

interface SettingsModeProps {
  mode: 'basic' | 'advanced';
  handleChangeMode: (event: React.MouseEvent<HTMLElement>, newMode: 'basic' | 'advanced') => void;
}

const SettingsMode = ({ mode, handleChangeMode }: SettingsModeProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'cool.100',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '12px',
      }}>
      <StyledToggleButtonGroup value={mode} exclusive onChange={handleChangeMode}>
        <ToggleButton
          sx={{
            textTransform: 'none',
            width: '100%',
            color: 'dark.900',
            typography: 'rm16',
          }}
          value="basic">
          Basic
        </ToggleButton>
        <ToggleButton
          sx={{
            textTransform: 'none',
            width: '100%',
            color: 'dark.900',
            typography: 'rm16',
          }}
          value="advanced">
          Advanced
        </ToggleButton>
      </StyledToggleButtonGroup>
    </Paper>
  );
};

const SettingsModal = ({ gasOptions, isOpen, goBack }: SettingsModalProps) => {
  const { slippage } = useAppSelector((state) => state.swap);
  const [mode, setMode] = useState<'basic' | 'advanced'>('basic');

  const handleChangeMode = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'basic' | 'advanced'
  ) => {
    setMode(newMode);
  };

  return (
    <Modal headerType={ModalHeaderType.AdvancedSettings} isOpen={isOpen} goBack={goBack}>
      <Accordion
        defaultExpanded
        sx={{
          mt: '15px',
        }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="slippage-accordion">
          <>
            <GasStation />
            <Typography
              sx={{
                marginLeft: '5px',
              }}
              variant="rm16">
              Gas price
            </Typography>
          </>
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
          expandIcon={<ExpandMoreIcon />}
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
                variant="rm16">
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
    </Modal>
  );
};

export default SettingsModal;
