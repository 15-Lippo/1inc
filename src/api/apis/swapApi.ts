import { APIS, SupportedChainId } from '../../constants';

export const SwapApi = (chainId: number | undefined) => {
  const config = new APIS[chainId ? (chainId as SupportedChainId) : SupportedChainId.MAINNET].Configuration({
    basePath: 'https://api.1inch.io',
  });
  // @ts-ignore
  const SwapApi = new APIS[chainId ? (chainId as SupportedChainId) : SupportedChainId.MAINNET].SwapApi(config);
  return SwapApi;
};
