'use client';

import { useMemo, useState } from 'react';
import CompanySearch from '@/components/CompanySearch';
import ComparisonTable from '@/components/ComparisonTable';
import TickerPills from '@/components/TickerPills';
import type { ComparisonState, TickerItemState } from '@/types';
import { getCompanyBundle, mapErrorToMessage } from '@/lib/api';

const MAX_TICKERS = 5;

const emptyItem: TickerItemState = {
  loading: false,
  error: '',
  companyData: null,
  quoteData: null,
  lastUpdated: null,
};

const initialState: ComparisonState = {
  tickers: [],
  byTicker: {},
  inputTicker: '',
};

export default function Page() {
  const [state, setState] = useState<ComparisonState>(initialState);
  const [uiError, setUiError] = useState<string>('');

  const anyLoading = useMemo(
    () => state.tickers.some((t) => state.byTicker[t]?.loading),
    [state.tickers, state.byTicker]
  );

  function removeTicker(ticker: string) {
    setUiError('');
    setState((s) => {
      const nextTickers = s.tickers.filter((t) => t !== ticker);
      const nextBy = { ...s.byTicker };
      delete nextBy[ticker];
      return { ...s, tickers: nextTickers, byTicker: nextBy };
    });
  }

  async function fetchTicker(ticker: string) {
    // mark loading for this ticker
    setState((s) => ({
      ...s,
      byTicker: {
        ...s.byTicker,
        [ticker]: { ...(s.byTicker[ticker] ?? emptyItem), loading: true, error: '' },
      },
    }));

    try {
      const { companyData, quoteData } = await getCompanyBundle(ticker);
      const lastUpdated = Date.now();
      setState((s) => ({
        ...s,
        byTicker: {
          ...s.byTicker,
          [ticker]: {
            loading: false,
            error: '',
            companyData,
            quoteData,
            lastUpdated,
          },
        },
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        byTicker: {
          ...s.byTicker,
          [ticker]: {
            loading: false,
            error: mapErrorToMessage(err, ticker),
            companyData: null,
            quoteData: null,
            lastUpdated: null,
          },
        },
      }));
    }
  }

  async function handleRefreshAll() {
    if (state.tickers.length === 0) return;
    setUiError('');
    await Promise.all(state.tickers.map((ticker) => fetchTicker(ticker)));
  }

  async function handleAddTicker(ticker: string) {
    setUiError('');

    if (state.tickers.includes(ticker)) {
      setUiError(`Ticker ${ticker} is already in the comparison.`);
      return;
    }

    if (state.tickers.length >= MAX_TICKERS) {
      setUiError(`You can compare up to ${MAX_TICKERS} tickers.`);
      return;
    }

    setState((s) => {
      return {
        ...s,
        inputTicker: ticker,
        tickers: [...s.tickers, ticker],
        byTicker: {
          ...s.byTicker,
          [ticker]: { ...(s.byTicker[ticker] ?? emptyItem), loading: true, error: '' },
        },
      };
    });

    await fetchTicker(ticker);
  }

  return (
    <main className="min-h-screen">
      <header className="mx-auto max-w-screen-xl px-4 py-10">
        <h1 className="text-2xl font-semibold">ASX Stock Comparison</h1>
        <p className="mt-2 text-sm text-[#6c757d]">
          Add up to {MAX_TICKERS} ASX tickers and compare key metrics side-by-side.
        </p>
      </header>

      <section className="mx-auto max-w-screen-xl px-4 pb-6">
        <div className="rounded-[8px] border border-[#e9ecef] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <CompanySearch
            initialTicker={state.inputTicker}
            onSearch={handleAddTicker}
            loading={anyLoading}
          />

          {uiError ? (
            <p role="alert" className="mt-3 text-sm text-[#dc3545]">
              {uiError}
            </p>
          ) : null}

          <div className="mt-4">
            <TickerPills tickers={state.tickers} onRemove={removeTicker} disabled={anyLoading} />
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleRefreshAll}
              disabled={anyLoading || state.tickers.length === 0}
              className="rounded-[8px] border border-[#0d6efd] bg-[#0d6efd] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0b5ed7] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {anyLoading ? 'Refreshing...' : 'Refresh All'}
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-screen-xl px-4 pb-16">
        <ComparisonTable tickers={state.tickers} byTicker={state.byTicker} />
      </section>
    </main>
  );
}
