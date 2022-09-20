import { BigNumber } from '@ethersproject/bignumber';

import { calculateGasMargin } from './calculateGasMargin';

describe('calculateGasMargin', () => {
  it('should return BigNumber which is 15 percent greater than the input', () => {
    const input = BigNumber.from(100000);
    const result = BigNumber.from(115000);
    expect(calculateGasMargin(input)).toEqual(result);
  });

  it('should return incorrectly calculated result', () => {
    const input = BigNumber.from(100000);
    const result = BigNumber.from(200000);
    expect(calculateGasMargin(input)).not.toEqual(result);
  });
});
