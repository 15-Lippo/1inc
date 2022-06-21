import React, { useState } from 'react';

import SettingsMode from '../SettingsMode';
import UseRadioGroup from '../UseRadioGroup';

export interface GasPriceOptionsProps {
  gasOptions: any;
}

const GasPriceOptions = ({ gasOptions }: GasPriceOptionsProps) => {
  const [mode, setMode] = useState<'basic' | 'advanced'>('basic');

  const handleChangeMode = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'basic' | 'advanced'
  ) => {
    setMode(newMode);
  };

  return (
    <>
      <SettingsMode mode={mode} handleChangeMode={handleChangeMode} />
      {mode === 'basic' ? <UseRadioGroup gasOptions={gasOptions} /> : null}
    </>
  );
};

export default GasPriceOptions;
