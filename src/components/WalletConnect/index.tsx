import React from 'react';
import { useCallback } from 'react';

import MainButton, { MainButtonType } from '../Buttons/MainButton';
import metaMask from './../../connector/metaMask';

const WalletConnect = () => {
  const [connector, hooks] = metaMask;
  const isActive = hooks.useIsActive();
  const onClick = useCallback(() => {
    console.log(connector, isActive);
    // if (isActive) {
    //   connector.deactivate();
    // } else {
    // connector.deactivate();
    connector.activate();
    // }
  }, [connector, isActive]);

  return (
    <div id={`connect-metaMask`} onClick={onClick}>
      <MainButton type={MainButtonType.Connect} />
    </div>
  );
};

export default WalletConnect;
