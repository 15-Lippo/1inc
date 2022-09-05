import { Paper } from '@mui/material';
import React from 'react';
import { Trans } from 'react-i18next';

import { StyledToggleButton, StyledToggleButtonGroup } from '../buttons';

interface SettingsModeProps {
  mode: 'basic' | 'advanced';
  handleChangeMode: (event: React.MouseEvent<HTMLElement>, newMode: 'basic' | 'advanced') => void;
}

const SettingsMode = ({ mode, handleChangeMode }: SettingsModeProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'widget.bg-01',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '12px',
      }}>
      <StyledToggleButtonGroup value={mode} exclusive onChange={handleChangeMode}>
        <StyledToggleButton
          sx={{
            textTransform: 'none',
            width: '100%',
            typography: 'rm16',
          }}
          value="basic">
          <Trans>Basic</Trans>
        </StyledToggleButton>
        <StyledToggleButton
          sx={{
            textTransform: 'none',
            width: '100%',
            typography: 'rm16',
          }}
          value="advanced">
          <Trans>Advanced</Trans>
        </StyledToggleButton>
      </StyledToggleButtonGroup>
    </Paper>
  );
};

export default SettingsMode;
