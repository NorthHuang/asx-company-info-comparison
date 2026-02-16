'use client';

import { useState } from 'react';
import CompanySearch from '@/components/CompanySearch';
import KeyStatistics from '@/components/KeyStatistics';
import CompanyInfo from '@/components/CompanyInfo';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { AppState } from '@/types';
import { getCompanyBundle, mapErrorToMessage } from '@/lib/api';

const initialState: AppState = {
  loading: false,
  error: '',
  companyData: null,
  quoteData: null,
  currentTicker: '',
};

export default function Page() {
  const [state, setState] = useState<AppState>(initialState);

  async function handleSearch(ticker: string) {
    setState((s) => ({
      ...s,
      loading: true,
      error: '',
      currentTicker: ticker,
    }));

    try {
      const { companyData, quoteData } = await getCompanyBundle(ticker);
      setState((s) => ({
        ...s,
        loading: false,
        companyData,
        quoteData,
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        companyData: null,
        quoteData: null,
        error: mapErrorToMessage(err, ticker),
      }));
    }
  }

  const hasResults = Boolean(state.companyData && state.quoteData);

  return (
    <main className="min-h-screen">
      <header className="mx-auto max-w-screen-xl px-4 py-10">
        <h1 className="text-2xl font-semibold">ASX Company Information</h1>
        <p className="mt-2 text-sm text-[#6c757d]">
          Search for Australian Stock Exchange listed companies
        </p>
      </header>

      {!hasResults ? (
        <section className="mx-auto flex max-w-screen-xl flex-col items-center justify-center px-4 pb-16 min-h-[60vh]">
          <div className="w-full max-w-xl rounded-[8px] border border-[#e9ecef] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
            <CompanySearch initialTicker={state.currentTicker} onSearch={handleSearch} loading={state.loading} />

            <div className="mt-6" aria-busy={state.loading}>
              {state.loading ? <LoadingSpinner text="Loading company information..." /> : null}
              {state.error ? <p role="alert" className="mt-3 text-sm text-[#dc3545]">{state.error}</p> : null}
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-screen-xl px-4 pb-16">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(350px,450px)_1fr]">
            <div className="space-y-6">
              <div className="rounded-[8px] border border-[#e9ecef] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
                <CompanySearch initialTicker={state.currentTicker} onSearch={handleSearch} loading={state.loading} />
                <div className="mt-4">
                  {state.loading ? <LoadingSpinner text="Loading company information..." /> : null}
                  {state.error ? <p role="alert" className="mt-3 text-sm text-[#dc3545]">{state.error}</p> : null}
                </div>
              </div>

              {/* Left column: Key statistics */}
              {state.quoteData ? <KeyStatistics quoteData={state.quoteData} /> : null}
            </div>

            {/* Right column: Company info */}
            {state.companyData ? <CompanyInfo companyData={state.companyData} /> : null}
          </div>
        </section>
      )}
    </main>
  );
}
