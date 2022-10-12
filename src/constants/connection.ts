import { MetamaskIcon } from '../components/icons';
import metaMask from '../packages/web3-provider/providers/metaMask';
import { ConnectionMethod, SupportedWallets } from '../types';

export const connectionMethods: Record<string, ConnectionMethod> = {
  [SupportedWallets.Metamask]: {
    name: 'Metamask',
    connector: metaMask,
    logo: MetamaskIcon,
  },
  // [SupportedWallets.WalletConnect]: {
  //   name: 'Wallet Connect',
  //   connector: walletConnect,
  //   logo: WalletConnectIcon,
  // },
};
