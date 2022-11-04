import { JsonRpcProvider } from '@ethersproject/providers';

import TokenHelper from '../../../abi/TokenHelperABI';
import { networkConfigs } from '../../../constants';
import { ZERO_ADDRESS } from '../../../constants/tokens';
import { SupportedChainId } from '../../../types';
import { getContract } from '../../../utils';

export interface IUserTokenInfo {
  [address: string]: {
    balance: string;
    allowance: string;
    pinned: boolean;
    priceInUsd?: string;
  };
}

export async function getTokenInfo(
  lib: JsonRpcProvider | undefined,
  chainId: number,
  addresses: string[],
  spender: string,
  account?: string
): Promise<Promise<IUserTokenInfo> | undefined> {
  if (!lib || !addresses.length) return;
  //@ts-ignore
  const favoriteTokens = JSON.parse(localStorage.getItem('favorite-tokens'));
  try {
    let tokenInfo;
    const contractAddress = networkConfigs[chainId as SupportedChainId].helperContract;

    // Get balances from the contract if only wallet was connected
    if (account && contractAddress) {
      console.log('Getting balances...');
      const tokenHelper = getContract(contractAddress, TokenHelper.abi, lib);
      tokenInfo = await tokenHelper.batchTokenInfo(account, addresses, spender);
    }

    const result: IUserTokenInfo = {};
    for (let i = 0; i < addresses.length; i++) {
      result[addresses[i]] = {
        balance: tokenInfo ? tokenInfo[i].balance.toString() : '',
        allowance: tokenInfo ? tokenInfo[i].allowance.toString() : '',
        pinned: favoriteTokens[chainId].includes(addresses[i]),
        priceInUsd: '',
      };
    }
    return result;
  } catch (e) {
    console.error('Attempt to batchTokenInfo failed: ', e);
  }
}

const chunkArray = (list: any[], chunkSize: number) => {
  const results = [];
  for (let i = 0; i < list.length / chunkSize; i++) {
    const from = i * chunkSize;
    const to = from + Math.min(chunkSize, list.length);
    const chunk = list.slice(from, to);
    results.push(chunk);
  }
  return results;
};

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export async function getTokenBalances(
  lib: JsonRpcProvider | undefined,
  chainId: number,
  addresses: string[],
  spender: string,
  account?: string
) {
  if (!addresses.length) return [];
  const arrayLength = 200;

  // Add native currency
  addresses.push(ZERO_ADDRESS);

  // multicall is limited by block size. if the request contains more than 600 addresses for the Ether network, the transaction will fail
  // that's why a big array should be divided into smaller arrays
  const chunks = chunkArray(addresses, arrayLength);

  const promises = [];
  for (const chunk of chunks) {
    // After the first connect to ethereum mainnet fork all promises will return not right away. Please connect wallet an wait (5-10 min)
    promises.push(await getTokenInfo(lib, chainId, chunk, spender, account));
  }
  const result = await Promise.all(promises);
  return result.reduce((pV, cV) => {
    return {
      ...pV,
      ...cV,
    };
  }, {});
}
