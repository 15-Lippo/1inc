import { ReferrerOptions } from '../types';

const addressRegex = /^0x[a-fA-F0-9]{40}$/;

export const validateReferrerOptions = ({ referrerAddress, fee }: ReferrerOptions): string => {
  const feeAsNum = parseFloat(fee);
  if (!feeAsNum || feeAsNum < 0 || feeAsNum > 3) return 'fee should be a numeric string between 0 and 3';
  if (!addressRegex.test(referrerAddress)) return 'referrerAddress should be a valid address';
  return '';
};
