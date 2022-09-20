import { toHex } from './toHex';

describe('toHex', () => {
  it('should return "0x1" when argument is 1', () => {
    expect(toHex(1)).toEqual('0x1');
  });

  it('should return "0x64" when argument is 100', () => {
    expect(toHex(100)).toEqual('0x64');
  });

  it('should return incorrectly converted result', () => {
    expect(toHex(1)).not.toEqual('0x11');
  });
});
