import { ReferrerOptions } from '../types';

const addressRegex = /^0x[a-fA-F0-9]{40}$/;

type KeyType = keyof ReferrerOptions;

export const validateReferrerOptions = (params: ReferrerOptions): string => {
  const key: KeyType = Number(Object.keys(params)[0]);
  const feeAsNum = parseFloat(params[key].fee);
  if (!feeAsNum || feeAsNum < 0 || feeAsNum > 3) return 'fee should be a numeric string between 0 and 3';
  if (!addressRegex.test(params[key].referrerAddress)) return 'referrerAddress should be a valid address';
  return '';
};
