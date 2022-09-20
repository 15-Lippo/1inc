import { BigNumber } from '@ethersproject/bignumber';

import { formatGweiFixed, formatUsdFixed, parseGwei } from './conversion';

const value = '1234567890';
const usdCoinDecimals = 6;

describe('formatGweiFixed', () => {
  it('should return "1.23" when argument is "1234567890"', () => {
    expect(formatGweiFixed(value)).toEqual('1.23');
  });

  it('should return incorrectly converted result', () => {
    expect(formatGweiFixed(value)).not.toEqual('1.23456');
  });
});

describe('formatUsdFixed', () => {
  it('should return "1234.57" when arguments are "1234567890" and 6', () => {
    expect(formatUsdFixed(value, usdCoinDecimals)).toEqual('1234.57');
  });

  it('should return incorrectly converted result', () => {
    expect(formatUsdFixed(value, usdCoinDecimals)).not.toEqual('1.23456');
  });
});

describe('parseGwei', () => {
  it('should return BigNumber ({ hex: "0x112210f4768db400", type: "BigNumber" }) when argument is "1234567890"', () => {
    expect(parseGwei(value)).toEqual(BigNumber.from({ hex: '0x112210f4768db400', type: 'BigNumber' }));
  });

  it('should return incorrectly converted result', () => {
    expect(parseGwei(value)).not.toEqual(BigNumber.from({ hex: '0x011f5021b400', type: 'BigNumber' }));
  });
});
