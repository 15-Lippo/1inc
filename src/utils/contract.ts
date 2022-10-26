import { isAddress } from '@ethersproject/address';
import { AddressZero } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';

export const getContract = (address: string, ABI: any, provider: JsonRpcProvider, account?: string): Contract => {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  const providerOrSigner = account ? provider.getSigner(account).connectUnchecked() : provider;
  return new Contract(address, ABI, providerOrSigner as any);
};
