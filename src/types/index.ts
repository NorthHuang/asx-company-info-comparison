export interface CompanyData {
  ticker: string;
  company_info: string;
}

export interface QuoteData {
  symbol: string;
  quote: {
    cf_last: number; // Current price
    cf_netchng: number; // Price change
    pctchng: number; // Percentage change
    cf_volume: number; // Volume
    mkt_value: number; // Market value
    '52wk_high': number; // 52 week high
  };
}

export interface AppState {
  loading: boolean;
  error: string;
  companyData: CompanyData | null;
  quoteData: QuoteData | null;
  currentTicker: string;
}
