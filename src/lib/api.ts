import type { CompanyData, QuoteData } from '@/types';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);

  if (!res.ok) {
    if (res.status === 404) {
      throw new ApiError('NOT_FOUND', 404);
    }
    if (res.status === 400) {
      throw new ApiError('BAD_REQUEST', 400);
    }
    throw new ApiError('UNKNOWN', res.status);
  }

  return (await res.json()) as T;
}

export function mapErrorToMessage(err: unknown, ticker?: string): string {
  if (err instanceof ApiError) {
    if (err.status === 404) return `Ticker '${ticker ?? ''}' not found or may be delisted`;
    if (err.status === 400) return 'Invalid request. Please check the ticker symbol';
    return 'Failed to fetch company information. Please try again later';
  }
  return 'Failed to fetch company information. Please try again later';
}

export async function getCompanyInformation(ticker: string): Promise<CompanyData> {
  const url = `/api/proxy/api/market_data/company_information?ticker=${encodeURIComponent(ticker)}`;
  return fetchJson<CompanyData>(url);
}

export async function getQuote(ticker: string): Promise<QuoteData> {
  const url = `/api/proxy/api/market_data/quotes?market_key=asx&listing_key=${encodeURIComponent(ticker)}`;
  return fetchJson<QuoteData>(url);
}

export async function getCompanyBundle(ticker: string): Promise<{
  companyData: CompanyData;
  quoteData: QuoteData;
}> {
  const [companyData, quoteData] = await Promise.all([
    getCompanyInformation(ticker),
    getQuote(ticker),
  ]);

  return { companyData, quoteData };
}
