import { Paper, ToggleButton } from '@mui/material';
import React from 'react';

import { StyledToggleButtonGroup } from '../Buttons/SlippageButtonsGroup';

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

export default SettingsMode;
