import { LocalStorageKeys } from '../constants/localStorageKeys';

export const countOfCustomTokens = (chainId: number | undefined) => {
  if (!chainId) return 0;
  try {
    const existingTokens = JSON.parse(localStorage.getItem(LocalStorageKeys.imported_tokens) as string) ?? [];
    if (!existingTokens) return 0;
    return Object.entries(existingTokens[chainId]).length;
  } catch (e) {
    return 0;
  }
};
