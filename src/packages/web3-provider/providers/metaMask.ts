import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';

import { toWeb3Connector } from './utils';

// @ts-ignore
const connector = initializeConnector<MetaMask>((actions) => new MetaMask(actions, false));

// @ts-ignore
export default toWeb3Connector(connector);
