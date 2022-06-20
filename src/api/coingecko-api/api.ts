// tslint:disable
/**
 * CoinGecko API V3
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 3.0.0
 *
 *
 * NOTE: This file is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the file manually.
 */

import * as isomorphicFetch from 'isomorphic-fetch';
import * as url from 'url';

import { Configuration } from './configuration';

const BASE_PATH = 'https://api.coingecko.com/api/v3'.replace(/\/+$/, '');

/**
 *
 * @export
 */
export const COLLECTION_FORMATS = {
  csv: ',',
  ssv: ' ',
  tsv: '\t',
  pipes: '|',
};

/**
 *
 * @export
 * @interface FetchAPI
 */
export interface FetchAPI {
  (url: string, init?: any): Promise<Response>;
}

/**
 *
 * @export
 * @interface FetchArgs
 */
export interface FetchArgs {
  url: string;
  options: any;
}

/**
 *
 * @export
 * @class BaseAPI
 */
export class BaseAPI {
  // @ts-ignore
  protected configuration: Configuration;

  constructor(
    configuration?: Configuration,
    protected basePath: string = BASE_PATH,
    protected fetch: FetchAPI = isomorphicFetch
  ) {
    if (configuration) {
      this.configuration = configuration;
      this.basePath = configuration.basePath || this.basePath;
    }
  }
}

/**
 *
 * @export
 * @class RequiredError
 * @extends {Error}
 */
export class RequiredError extends Error {
  // @ts-ignore
  name: 'RequiredError';
  constructor(public field: string, msg?: string) {
    super(msg);
  }
}

/**
 * CoinsApi - fetch parameter creator
 * @export
 */
export const CoinsApiFetchParamCreator = function (configuration?: Configuration) {
  return {
    /**
     * Get current data (name, price, market, ... including exchange tickers) for a coin.<br><br> **IMPORTANT**:  Ticker object is limited to 100 items, to get more tickers, use `/coins/{id}/tickers`  Ticker `is_stale` is true when ticker that has not been updated/unchanged from the exchange for a while.  Ticker `is_anomaly` is true if ticker's price is outliered by our system.  You are responsible for managing how you want to display these information (e.g. footnote, different background, change opacity, hide)
     * @summary Get current data (name, price, market, ... including exchange tickers) for a coin
     * @param {string} id pass the coin id (can be obtained from /coins) eg. bitcoin
     * @param {string} [localization] Include all localized languages in response (true/false) &lt;b&gt;[default: true]&lt;/b&gt;
     * @param {boolean} [tickers] Include tickers data (true/false) &lt;b&gt;[default: true]&lt;/b&gt;
     * @param {boolean} [marketData] Include market_data (true/false) &lt;b&gt;[default: true]&lt;/b&gt;
     * @param {boolean} [communityData] Include community_data data (true/false) &lt;b&gt;[default: true]&lt;/b&gt;
     * @param {boolean} [developerData] Include developer_data data (true/false) &lt;b&gt;[default: true]&lt;/b&gt;
     * @param {boolean} [sparkline] Include sparkline 7 days data (eg. true, false) &lt;b&gt;[default: false]&lt;/b&gt;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    coinsIdGet(
      id: string,
      localization?: string,
      tickers?: boolean,
      marketData?: boolean,
      communityData?: boolean,
      developerData?: boolean,
      sparkline?: boolean,
      options: any = {}
    ): FetchArgs {
      // verify required parameter 'id' is not null or undefined
      if (id === null || id === undefined) {
        throw new RequiredError(
          'id',
          'Required parameter id was null or undefined when calling coinsIdGet.'
        );
      }
      const localVarPath = `/coins/{id}`.replace(`{${'id'}}`, encodeURIComponent(String(id)));
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      if (localization !== undefined) {
        localVarQueryParameter['localization'] = localization;
      }

      if (tickers !== undefined) {
        localVarQueryParameter['tickers'] = tickers;
      }

      if (marketData !== undefined) {
        localVarQueryParameter['market_data'] = marketData;
      }

      if (communityData !== undefined) {
        localVarQueryParameter['community_data'] = communityData;
      }

      if (developerData !== undefined) {
        localVarQueryParameter['developer_data'] = developerData;
      }

      if (sparkline !== undefined) {
        localVarQueryParameter['sparkline'] = sparkline;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      // @ts-ignore
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     * Use this to obtain all the coins' id in order to make API calls
     * @summary List all supported coins id, name and symbol (no pagination required)
     * @param {boolean} [includePlatform] flag to include platform contract addresses (eg. 0x.... for Ethereum based tokens).   valid values: true, false
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    coinsListGet(includePlatform?: boolean, options: any = {}): FetchArgs {
      const localVarPath = `/coins/list`;
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      if (includePlatform !== undefined) {
        localVarQueryParameter['include_platform'] = includePlatform;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      // @ts-ignore
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
  };
};

/**
 * CoinsApi - functional programming interface
 * @export
 */
export const CoinsApiFp = function (configuration?: Configuration) {
  return {
    /**
     * Get current data (name, price, market, ... including exchange tickers) for a coin.<br><br> **IMPORTANT**:  Ticker object is limited to 100 items, to get more tickers, use `/coins/{id}/tickers`  Ticker `is_stale` is true when ticker that has not been updated/unchanged from the exchange for a while.  Ticker `is_anomaly` is true if ticker's price is outliered by our system.  You are responsible for managing how you want to display these information (e.g. footnote, different background, change opacity, hide)
     * @summary Get current data (name, price, market, ... including exchange tickers) for a coin
     * @param {string} id pass the coin id (can be obtained from /coins) eg. bitcoin
     * @param {string} [localization] Include all localized languages in response (true/false) &lt;b&gt;[default: true]&lt;/b&gt;
     * @param {boolean} [tickers] Include tickers data (true/false) &lt;b&gt;[default: true]&lt;/b&gt;
     * @param {boolean} [marketData] Include market_data (true/false) &lt;b&gt;[default: true]&lt;/b&gt;
     * @param {boolean} [communityData] Include community_data data (true/false) &lt;b&gt;[default: true]&lt;/b&gt;
     * @param {boolean} [developerData] Include developer_data data (true/false) &lt;b&gt;[default: true]&lt;/b&gt;
     * @param {boolean} [sparkline] Include sparkline 7 days data (eg. true, false) &lt;b&gt;[default: false]&lt;/b&gt;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    coinsIdGet(
      id: string,
      localization?: string,
      tickers?: boolean,
      marketData?: boolean,
      communityData?: boolean,
      developerData?: boolean,
      sparkline?: boolean,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<Response> {
      const localVarFetchArgs = CoinsApiFetchParamCreator(configuration).coinsIdGet(
        id,
        localization,
        tickers,
        marketData,
        communityData,
        developerData,
        sparkline,
        options
      );
      return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
        return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then(
          (response) => {
            if (response.status >= 200 && response.status < 300) {
              return response;
            } else {
              throw response;
            }
          }
        );
      };
    },
    /**
     * Use this to obtain all the coins' id in order to make API calls
     * @summary List all supported coins id, name and symbol (no pagination required)
     * @param {boolean} [includePlatform] flag to include platform contract addresses (eg. 0x.... for Ethereum based tokens).   valid values: true, false
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    coinsListGet(
      includePlatform?: boolean,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<Response> {
      const localVarFetchArgs = CoinsApiFetchParamCreator(configuration).coinsListGet(
        includePlatform,
        options
      );
      return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
        return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then(
          (response) => {
            if (response.status >= 200 && response.status < 300) {
              return response;
            } else {
              throw response;
            }
          }
        );
      };
    },
  };
};

/**
 * CoinsApi - factory interface
 * @export
 */
export const CoinsApiFactory = function (
  configuration?: Configuration,
  fetch?: FetchAPI,
  basePath?: string
) {
  return {
    /**
     * Get current data (name, price, market, ... including exchange tickers) for a coin.<br><br> **IMPORTANT**:  Ticker object is limited to 100 items, to get more tickers, use `/coins/{id}/tickers`  Ticker `is_stale` is true when ticker that has not been updated/unchanged from the exchange for a while.  Ticker `is_anomaly` is true if ticker's price is outliered by our system.  You are responsible for managing how you want to display these information (e.g. footnote, different background, change opacity, hide)
     * @summary Get current data (name, price, market, ... including exchange tickers) for a coin
     * @param {string} id pass the coin id (can be obtained from /coins) eg. bitcoin
     * @param {string} [localization] Include all localized languages in response (true/false) &lt;b&gt;[default: true]&lt;/b&gt;
     * @param {boolean} [tickers] Include tickers data (true/false) &lt;b&gt;[default: true]&lt;/b&gt;
     * @param {boolean} [marketData] Include market_data (true/false) &lt;b&gt;[default: true]&lt;/b&gt;
     * @param {boolean} [communityData] Include community_data data (true/false) &lt;b&gt;[default: true]&lt;/b&gt;
     * @param {boolean} [developerData] Include developer_data data (true/false) &lt;b&gt;[default: true]&lt;/b&gt;
     * @param {boolean} [sparkline] Include sparkline 7 days data (eg. true, false) &lt;b&gt;[default: false]&lt;/b&gt;
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    coinsIdGet(
      id: string,
      localization?: string,
      tickers?: boolean,
      marketData?: boolean,
      communityData?: boolean,
      developerData?: boolean,
      sparkline?: boolean,
      options?: any
    ) {
      return CoinsApiFp(configuration).coinsIdGet(
        id,
        localization,
        tickers,
        marketData,
        communityData,
        developerData,
        sparkline,
        options
      )(fetch, basePath);
    },
    /**
     * Use this to obtain all the coins' id in order to make API calls
     * @summary List all supported coins id, name and symbol (no pagination required)
     * @param {boolean} [includePlatform] flag to include platform contract addresses (eg. 0x.... for Ethereum based tokens).   valid values: true, false
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    coinsListGet(includePlatform?: boolean, options?: any) {
      return CoinsApiFp(configuration).coinsListGet(includePlatform, options)(fetch, basePath);
    },
  };
};

/**
 * CoinsApi - object-oriented interface
 * @export
 * @class CoinsApi
 * @extends {BaseAPI}
 */
export class CoinsApi extends BaseAPI {
  /**
   * Get current data (name, price, market, ... including exchange tickers) for a coin.<br><br> **IMPORTANT**:  Ticker object is limited to 100 items, to get more tickers, use `/coins/{id}/tickers`  Ticker `is_stale` is true when ticker that has not been updated/unchanged from the exchange for a while.  Ticker `is_anomaly` is true if ticker's price is outliered by our system.  You are responsible for managing how you want to display these information (e.g. footnote, different background, change opacity, hide)
   * @summary Get current data (name, price, market, ... including exchange tickers) for a coin
   * @param {string} id pass the coin id (can be obtained from /coins) eg. bitcoin
   * @param {string} [localization] Include all localized languages in response (true/false) &lt;b&gt;[default: true]&lt;/b&gt;
   * @param {boolean} [tickers] Include tickers data (true/false) &lt;b&gt;[default: true]&lt;/b&gt;
   * @param {boolean} [marketData] Include market_data (true/false) &lt;b&gt;[default: true]&lt;/b&gt;
   * @param {boolean} [communityData] Include community_data data (true/false) &lt;b&gt;[default: true]&lt;/b&gt;
   * @param {boolean} [developerData] Include developer_data data (true/false) &lt;b&gt;[default: true]&lt;/b&gt;
   * @param {boolean} [sparkline] Include sparkline 7 days data (eg. true, false) &lt;b&gt;[default: false]&lt;/b&gt;
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CoinsApi
   */
  public coinsIdGet(
    id: string,
    localization?: string,
    tickers?: boolean,
    marketData?: boolean,
    communityData?: boolean,
    developerData?: boolean,
    sparkline?: boolean,
    options?: any
  ) {
    return CoinsApiFp(this.configuration).coinsIdGet(
      id,
      localization,
      tickers,
      marketData,
      communityData,
      developerData,
      sparkline,
      options
    )(this.fetch, this.basePath);
  }

  /**
   * Use this to obtain all the coins' id in order to make API calls
   * @summary List all supported coins id, name and symbol (no pagination required)
   * @param {boolean} [includePlatform] flag to include platform contract addresses (eg. 0x.... for Ethereum based tokens).   valid values: true, false
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CoinsApi
   */
  public coinsListGet(includePlatform?: boolean, options?: any) {
    return CoinsApiFp(this.configuration).coinsListGet(includePlatform, options)(
      this.fetch,
      this.basePath
    );
  }
}
/**
 * SearchApi - fetch parameter creator
 * @export
 */
export const SearchApiFetchParamCreator = function (configuration?: Configuration) {
  return {
    /**
     * Search for coins, categories and markets listed on CoinGecko ordered by largest Market Cap first
     * @summary Search for coins, categories and markets on CoinGecko
     * @param {string} query Search string
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    searchGet(query: string, options: any = {}): FetchArgs {
      // verify required parameter 'query' is not null or undefined
      if (query === null || query === undefined) {
        throw new RequiredError(
          'query',
          'Required parameter query was null or undefined when calling searchGet.'
        );
      }
      const localVarPath = `/search`;
      const localVarUrlObj = url.parse(localVarPath, true);
      const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      if (query !== undefined) {
        localVarQueryParameter['query'] = query;
      }

      localVarUrlObj.query = Object.assign(
        {},
        localVarUrlObj.query,
        localVarQueryParameter,
        options.query
      );
      // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
      // @ts-ignore
      delete localVarUrlObj.search;
      localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

      return {
        url: url.format(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
  };
};

/**
 * SearchApi - functional programming interface
 * @export
 */
export const SearchApiFp = function (configuration?: Configuration) {
  return {
    /**
     * Search for coins, categories and markets listed on CoinGecko ordered by largest Market Cap first
     * @summary Search for coins, categories and markets on CoinGecko
     * @param {string} query Search string
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    searchGet(
      query: string,
      options?: any
    ): (fetch?: FetchAPI, basePath?: string) => Promise<Response> {
      const localVarFetchArgs = SearchApiFetchParamCreator(configuration).searchGet(query, options);
      return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
        return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then(
          (response) => {
            if (response.status >= 200 && response.status < 300) {
              return response;
            } else {
              throw response;
            }
          }
        );
      };
    },
  };
};

/**
 * SearchApi - factory interface
 * @export
 */
export const SearchApiFactory = function (
  configuration?: Configuration,
  fetch?: FetchAPI,
  basePath?: string
) {
  return {
    /**
     * Search for coins, categories and markets listed on CoinGecko ordered by largest Market Cap first
     * @summary Search for coins, categories and markets on CoinGecko
     * @param {string} query Search string
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    searchGet(query: string, options?: any) {
      return SearchApiFp(configuration).searchGet(query, options)(fetch, basePath);
    },
  };
};

/**
 * SearchApi - object-oriented interface
 * @export
 * @class SearchApi
 * @extends {BaseAPI}
 */
export class SearchApi extends BaseAPI {
  /**
   * Search for coins, categories and markets listed on CoinGecko ordered by largest Market Cap first
   * @summary Search for coins, categories and markets on CoinGecko
   * @param {string} query Search string
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof SearchApi
   */
  public searchGet(query: string, options?: any) {
    return SearchApiFp(this.configuration).searchGet(query, options)(this.fetch, this.basePath);
  }
}
