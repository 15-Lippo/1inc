import { roundPercentInRoutes } from './roundPercentInRoutes';

describe('roundPercentInRoutes', () => {
  const num = 11.1234;

  it('should return "11.1" when second argument is 1', () => {
    expect(roundPercentInRoutes(num, 1)).toEqual('11.1');
  });

  it('should return "11.123" when second argument is 3', () => {
    expect(roundPercentInRoutes(num, 3)).toEqual('11.123');
  });

  it('should return incorrectly rounded result', () => {
    expect(roundPercentInRoutes(num, 2)).not.toEqual('11.123');
  });
});
