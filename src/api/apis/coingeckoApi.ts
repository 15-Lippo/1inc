import * as COIN_GECKO_API from '../coingecko-api';

const geckoConfig = new COIN_GECKO_API.Configuration({
  basePath: 'https://api.coingecko.com/api/v3',
});

export const CoinsApi = new COIN_GECKO_API.CoinsApi(geckoConfig);
export const SearchApi = new COIN_GECKO_API.SearchApi(geckoConfig);
