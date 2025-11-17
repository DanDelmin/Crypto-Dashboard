import { httpClient } from '@/shared/api/httpClient';
import type {
  CryptoMarketItem,
  CryptoMarketParams,
  CryptoDetails,
  CryptoMarketChart,
} from '@/entities/crypto';

const DEFAULT_MARKET_PARAMS: CryptoMarketParams = {
  vs_currency: 'usd',
  order: 'market_cap_desc',
  per_page: 50,
  page: 1,
  sparkline: false,
};

export async function fetchCryptoMarkets(
  params: Partial<CryptoMarketParams> = {},
): Promise<CryptoMarketItem[]> {
  const queryParams: CryptoMarketParams = {
    ...DEFAULT_MARKET_PARAMS,
    ...params,
  };

  const response = await httpClient.get<CryptoMarketItem[]>('/coins/markets', {
    params: queryParams,
  });

  return response.data;
}

// Детальная информация о монете
export async function fetchCryptoDetails(id: string): Promise<CryptoDetails> {
  const response = await httpClient.get<CryptoDetails>(`/coins/${id}`, {
    params: {
      localization: false,
      tickers: false,
      community_data: false,
      developer_data: false,
      sparkline: false,
    },
  });

  return response.data;
}

// Данные для графика цены (7 дней по умолчанию)
export async function fetchCryptoMarketChart(
  id: string,
  days = 7,
): Promise<CryptoMarketChart> {
  const response = await httpClient.get<CryptoMarketChart>(
    `/coins/${id}/market_chart`,
    {
      params: {
        vs_currency: 'usd',
        days,
      },
    },
  );

  return response.data;
}
