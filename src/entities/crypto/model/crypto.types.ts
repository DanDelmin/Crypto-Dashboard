export interface CryptoMarketItem {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number | null;
}

export interface CryptoMarketParams {
  vs_currency: 'usd';
  order?: string;
  per_page?: number;
  page?: number;
  sparkline?: boolean;
}

export interface CryptoDetails {
  id: string;
  symbol: string;
  name: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    price_change_percentage_24h: number | null;
    high_24h: {
      usd: number | null;
    };
    low_24h: {
      usd: number | null;
    };
    market_cap: {
      usd: number | null;
    };
  };
}

// Ответ для графика / рыночных данных за период
export interface CryptoMarketChart {
  // [timestamp, price]
  prices: [number, number][];
}
