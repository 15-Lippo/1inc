import React, { useState } from 'react';

import SettingsMode from '../SettingsMode';
import UseRadioGroup from '../UseRadioGroup';

interface GasPriceOptionsProps {
  gasOptions: any;
}

const GasPriceOptions = ({ gasOptions }: GasPriceOptionsProps) => {
  const [mode, setMode] = useState<'basic' | 'advanced'>('basic');

  const handleChangeMode = (_event: React.MouseEvent<HTMLElement>, newMode: 'basic' | 'advanced') => {
    setMode(newMode);
  };

  return (
    <React.Fragment>
      <SettingsMode mode={mode} handleChangeMode={handleChangeMode} />
      {mode === 'basic' ? <UseRadioGroup gasOptions={gasOptions} /> : null}
    </React.Fragment>
  );
};

export default GasPriceOptions;
