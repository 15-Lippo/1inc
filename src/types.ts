export {};

export interface ReferrerOptions {
  [chainId: number]: {
    referrerAddress: string;
    fee: string;
  };
}

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}
