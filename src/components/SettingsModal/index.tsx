import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import React from 'react';

import { useAppSelector } from '../../store/hooks';
import { SlippageButtonsGroup } from '../Buttons/SlippageButtonsGroup';
import GasPriceOptions from '../GasPriceOptions';
import GasStation from '../icons/GasStation';
import SlippageWaves from '../icons/SlippageWaves';
import Modal, { ModalHeaderType } from '../Modal';

interface SettingsModalProps {
  isOpen: boolean;
  goBack: () => void;
  gasOptions: any;
}

const SettingsModal = ({ gasOptions, isOpen, goBack }: SettingsModalProps) => {
  const { slippage } = useAppSelector((state) => state.swap);

  return (
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
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="slippage-accordion">
            <>
              <GasStation />
              <Typography
                sx={{
                  marginLeft: '5px',
                }}
                variant="sbm16">
                Gas price
              </Typography>
            </>
          </AccordionSummary>
          <AccordionDetails>
            <GasPriceOptions gasOptions={gasOptions} />
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
      </Box>
    </Modal>
  );
};

export default SettingsModal;
