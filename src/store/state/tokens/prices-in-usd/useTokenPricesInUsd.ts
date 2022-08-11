import { parseUnits } from '@ethersproject/units';

import { SwapApi } from '../../../../api';
import { useActiveWeb3React } from '../../../../packages/web3-provider';
import { Field } from '../../../../types';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { Token, updatePriceTokenInUsd } from '../tokensSlice';
import { useUsdStablecoins } from './useUsdStablecoins';

export const useTokenPricesInUsd = (usdStablecoinAddresses: string[], defaultStablecoin: Token | undefined) => {
  const { chainId } = useActiveWeb3React();
  const dispatch = useAppDispatch();
  const tokens = useAppSelector((state) => state.tokens.tokens);

  const one = (decimals: number) => parseUnits('1', decimals).toString();

  const fetchTokenUsdPrice = async (fromAddress: string, fromTokenDecimals: number, stablecoinAddress: string) => {
    try {
      const JSONApiResponse = await SwapApi(chainId).exchangeControllerGetQuoteRaw({
        fromTokenAddress: fromAddress,
        toTokenAddress: stablecoinAddress,
        amount: one(fromTokenDecimals),
      });
      const responseInfo = await JSONApiResponse.raw.json();
      return await responseInfo.toTokenAmount;
    } catch (error) {
      console.error(error);
    }
  };

  return async (addresses: string[]) => {
    if (!addresses.length || !defaultStablecoin || !usdStablecoinAddresses.length) return;

    const usdStablecoinAddressesSet = new Set<string>(usdStablecoinAddresses);
    const updateResults: (Promise<string> | string)[] = [];

    addresses.forEach((address) => {
      if (usdStablecoinAddressesSet.has(address)) {
        updateResults.push(one(defaultStablecoin.decimals));
      } else {
        tokens[address] &&
          updateResults.push(fetchTokenUsdPrice(address, tokens[address].decimals, defaultStablecoin.address));
      }
    });

    Promise.all(updateResults).then((res) => {
      dispatch(
        updatePriceTokenInUsd(
          addresses.map((addr, i) => ({
            key: addr,
            priceInUsd: res[i],
          }))
        )
      );
    });
  };
};

export const useUpdateUsdcPricesForBalances = () => {
  const { usdStablecoinAddresses, defaultStablecoin } = useUsdStablecoins();
  const updateUsdPrices = useTokenPricesInUsd(usdStablecoinAddresses, defaultStablecoin);
  const tokens = useAppSelector((state) => state.tokens.tokens);
  const tokenAddressesToUpdate = Object.keys(tokens).filter((address) => Number(tokens[address].userBalance));
  return () => updateUsdPrices(tokenAddressesToUpdate);
};

export const useUpdateUsdcPriceForSelectedTokens = () => {
  const { usdStablecoinAddresses, defaultStablecoin } = useUsdStablecoins();
  const updateUsdPrices = useTokenPricesInUsd(usdStablecoinAddresses, defaultStablecoin);
  const { INPUT, OUTPUT } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap[Field.INPUT]],
    OUTPUT: state.tokens.tokens[state.swap[Field.OUTPUT]],
  }));
  return () => updateUsdPrices([INPUT?.address, OUTPUT?.address]);
};
