import React from 'react';
import { useCallback } from 'react';

import { connectors, Web3ConnectorType } from '../../packages/web3-provider';
import { MainButton, MainButtonType } from '../buttons';

const WalletConnect = () => {
  const [connector, hooks] = connectors[0] as Web3ConnectorType; // only metamask
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
