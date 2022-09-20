import { totalRouteSteps } from './totalRouteSteps';

const protocols = [
  [
    [
      {
        name: 'DXSWAP',
        part: 100,
        fromTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        toTokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
      },
    ],
  ],
];

describe('totalRouteSteps', () => {
  it('should return 1 as number of route steps', () => {
    expect(totalRouteSteps(protocols)).toEqual(1);
  });

  it('should return incorrectly calculated result', () => {
    expect(totalRouteSteps(protocols)).not.toEqual(2);
  });
});
