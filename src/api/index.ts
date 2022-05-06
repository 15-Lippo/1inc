import * as API from '@yozh-io/1inch-widget-api-client';

const config = new API.Configuration({ basePath: process.env.REACT_APP_BASE_PATH });

export const HealthcheckApi = new API.HealthcheckApi(config);
export const ApproveApi = new API.ApproveApi(config);
export const InfoApi = new API.InfoApi(config);
export const SwapApi = new API.SwapApi(config);
