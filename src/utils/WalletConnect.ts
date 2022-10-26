// import 'setimmediate';

import { WalletConnect, WalletConnectConstructorArgs } from '@web3-react/walletconnect';
import { Buffer } from 'buffer';

// WalletConnect relies on Buffer, so it must be polyfilled.
if (!('Buffer' in window)) {
  window.Buffer = Buffer;
}

export class WalletConnectPopup extends WalletConnect {
  constructor({ actions, options, defaultChainId, timeout, onError }: WalletConnectConstructorArgs) {
    super({ actions, options: { ...options, qrcode: true }, defaultChainId, timeout, onError });
  }
}
