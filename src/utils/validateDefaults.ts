import _ from 'lodash';

import { ALL_SUPPORTED_CHAIN_IDS } from '../constants';
import { DefaultTokenOptions, defaultTypedValueOptions, ReferrerOptions } from '../types';

const addressRegex = /^0x[a-fA-F0-9]{40}$/;

export const validateSupportedChains = (chainIds: string[]): { hasNotSupported: boolean; notSupported: string[] } => {
  const notSupported = chainIds.filter((chainId: string) => !ALL_SUPPORTED_CHAIN_IDS.has(parseFloat(chainId)));
  return {
    hasNotSupported: notSupported.length > 0,
    notSupported,
  };
};

export const validateReferrerOptions = (params: ReferrerOptions): string => {
  const { hasNotSupported, notSupported } = validateSupportedChains(Object.keys(params));
  if (hasNotSupported) {
    return `${notSupported} chains are not supported`;
  }

  for (const chainId in params) {
    const feeAsNum = parseFloat(params[chainId].fee);
    if (!feeAsNum || feeAsNum < 0 || feeAsNum > 3) return 'fee should be a numeric string between 0 and 3';
    if (!addressRegex.test(params[chainId].referrerAddress)) return 'referrerAddress should be a valid address';
  }
  return '';
};

export const validateDefaultTokensOptions = (input?: DefaultTokenOptions, output?: DefaultTokenOptions): string => {
  const allChains = Object.keys(input && output ? { ...input, ...output } : input ? input : output ? output : []);
  if (allChains.length < 0) return '';

  const { hasNotSupported, notSupported } = validateSupportedChains(allChains);
  if (hasNotSupported) {
    return `${notSupported} chains are not supported. You should remove unsupported chains`;
  }

  for (const chainId of ALL_SUPPORTED_CHAIN_IDS) {
    if (input && !addressRegex.test(input[chainId]))
      return `input token address for ${chainId} should be a valid address`;
    if (output && !addressRegex.test(output[chainId]))
      return `output token address for ${chainId} should be a valid address`;
    if (input && output && input[chainId].toLowerCase() === output[chainId].toLowerCase())
      return `input token address should not be the same as the output token address for the same chainId (${chainId})`;
  }
  return '';
};

export const validateDefaultValue = (params: defaultTypedValueOptions): string => {
  if (_.isEmpty(params)) {
    return 'Empty object passed as defaultValue';
  }

  const { hasNotSupported, notSupported } = validateSupportedChains(Object.keys(params));

  if (hasNotSupported) {
    return `${notSupported} chains are not supported`;
  }

  if (!Object.values(params).every((val) => Number(val))) {
    return 'defaultValue keys must be chainIds and values must be BigNumberish (BigNumber | Bytes | bigint | string | number) with decimals that correspond to default input token';
  }
  return '';
};
