import { ExternalProvider, JsonRpcFetchFunc, Web3Provider } from '@ethersproject/providers';

export const getLibrary = (provider: ExternalProvider | JsonRpcFetchFunc) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
};
