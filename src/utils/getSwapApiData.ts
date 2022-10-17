import { ethereumApi } from '@yozh-io/1inch-widget-api-client';

export const getSwapApiData = async (
  apiData: Promise<ethereumApi.ApiResponse<ethereumApi.QuoteResponseDto | ethereumApi.SwapResponseDto>>
): Promise<any> => {
  try {
    return (await apiData).raw.json();
  } catch (error) {
    const e = await error.json();
    if (e.description) {
      const { description } = e;
      throw new Error(description.replace(/^./, description[0].toUpperCase()));
    }
    throw error.message;
  }
};
