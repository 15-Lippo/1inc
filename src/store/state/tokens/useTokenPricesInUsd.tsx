import { parseUnits } from '@ethersproject/units';
import { useMemo } from 'react';

import { SwapApi } from '../../../api';
import { useActiveWeb3React } from '../../../packages/web3-provider';
import { Field } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { updatePriceTokenInUsd } from './tokensSlice';

export const useTokenPricesInUsd = () => {
  const { chainId } = useActiveWeb3React();
  const dispatch = useAppDispatch();
  const { INPUT, OUTPUT, tokens } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap[Field.INPUT]],
    OUTPUT: state.tokens.tokens[state.swap[Field.OUTPUT]],
    tokens: state.tokens.tokens,
  }));

  const usdcTokenAddress = useMemo(
    () => Object.values(tokens).find((token) => token.name === 'USD Coin')?.address,
    [tokens]
  );

  const fetchTokenUsdcPrice = async (fromAddress: string, usdcTokenAddress: string, decimals: number) => {
    try {
      const JSONApiResponse = await SwapApi(chainId).exchangeControllerGetQuoteRaw({
        fromTokenAddress: fromAddress,
        toTokenAddress: usdcTokenAddress,
        amount: parseUnits('1', decimals).toString(),
      });
      const responseInfo = await JSONApiResponse.raw.json();
      return await responseInfo.toTokenAmount;
    } catch (error) {
      console.error(error);
    }
  };

  const updateUsdcPrices = async (addresses: string[]) => {
    if (!usdcTokenAddress) throw new Error('USDC not found in state.tokens');

    if (!addresses.length) return;

    const updateResults: (Promise<string> | string)[] = [];
    addresses.forEach((address) => {
      if (address === usdcTokenAddress) {
        updateResults.push(parseUnits('1', tokens[usdcTokenAddress].decimals).toString());
      } else {
        updateResults.push(fetchTokenUsdcPrice(address, usdcTokenAddress, tokens[address].decimals));
      }
    });

    Promise.all(updateResults).then((res) => {
      dispatch(updatePriceTokenInUsd(addresses.map((addr, i) => ({ key: addr, priceInUsd: res[i] }))));
    });
  };

  const updateUsdcPricesForBalances = () => {
    const tokenAddressesToUpdate = Object.keys(tokens).filter((address) => Number(tokens[address].userBalance));
    updateUsdcPrices(tokenAddressesToUpdate);
  };

  const updateUsdcPriceForSelectedTokens = () => {
    updateUsdcPrices([INPUT.address, OUTPUT.address]);
  };

  return { updateUsdcPricesForBalances, updateUsdcPriceForSelectedTokens };
};
