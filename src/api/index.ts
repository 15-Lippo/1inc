import * as API from '@yozh-io/1inch-widget-api-client';

import * as COIN_GECKO_API from './coingecko-api';

const config = new API.Configuration({ basePath: 'https://api.1inch.io' });
const geckoConfig = new COIN_GECKO_API.Configuration({
  basePath: 'https://api.coingecko.com/api/v3',
});

export const HealthcheckApi = new API.HealthcheckApi(config);
export const ApproveApi = new API.ApproveApi(config);
export const InfoApi = new API.InfoApi(config);
export const SwapApi = new API.SwapApi(config);

export const CoinsApi = new COIN_GECKO_API.CoinsApi(geckoConfig);
export const SearchApi = new COIN_GECKO_API.SearchApi(geckoConfig);
