import { JsonRpcProvider } from '@ethersproject/providers';
import {
  Actions,
  AddEthereumChainParameter,
  Connector,
  ProviderConnectInfo,
  ProviderRpcError,
} from '@web3-react/types';

import { toHex } from '../../utils';

function parseChainId(chainId: string) {
  return Number.parseInt(chainId, 16);
}

export default class JsonRpcConnector extends Connector {
  constructor(actions: Actions, public customProvider: JsonRpcProvider) {
    super(actions);
    // @ts-ignore
    customProvider.provider
      .on('connect', ({ chainId }: ProviderConnectInfo): void => {
        this.actions.update({ chainId: parseChainId(chainId) });
      })
      .on('disconnect', (error: ProviderRpcError): void => {
        this.actions.reportError(error);
      })
      .on('chainChanged', (chainId: string): void => {
        this.actions.update({ chainId: parseChainId(chainId) });
      })
      .on('accountsChanged', (accounts: string[]): void => {
        this.actions.update({ accounts });
      });
  }

  async activate(desiredChainIdOrChainParameters?: number | AddEthereumChainParameter): Promise<void> {
    let cancelActivation: () => void;
    // @ts-ignore
    if (!this.customProvider.provider?.isConnected?.()) cancelActivation = this.actions.startActivation();

    return Promise.all([
      // @ts-ignore
      this.customProvider.provider.request({ method: 'eth_chainId' }) as Promise<string>,
      // @ts-ignore
      this.customProvider.provider.request({ method: 'eth_requestAccounts' }) as Promise<string[]>,
    ])
      .then(([chainId, accounts]) => {
        const desiredChainId =
          typeof desiredChainIdOrChainParameters === 'number'
            ? desiredChainIdOrChainParameters
            : desiredChainIdOrChainParameters?.chainId;

        const receivedChainId = parseChainId(chainId);

        // If there's no desired chain or it's equal to the received, than update
        if (!desiredChainId || receivedChainId === desiredChainId) {
          return this.actions.update({ chainId: receivedChainId, accounts });
        }

        const desiredChainIdHex = toHex(desiredChainId);
        // @ts-ignore
        return this.customProvider.provider
          .request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: desiredChainIdHex }],
          })
          .catch((error: any) => {
            console.error(error);
            // This error code indicates that the chain has not been added to MetaMask
            if (error.code === 4902 && typeof desiredChainIdOrChainParameters !== 'number') {
              // @ts-ignore
              return this.customProvider.provider.request({
                method: 'wallet_addEthereumChain',
                params: [{ ...desiredChainIdOrChainParameters, chainId: desiredChainIdHex }],
              });
            } else {
              throw error;
            }
          })
          .then(() => this.activate(desiredChainId));
      })
      .catch((error) => {
        console.error(error);
        cancelActivation?.();
        throw error;
      });
  }
}
