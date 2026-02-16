'use client';

import { useMemo, useState } from 'react';

const POPULAR = ['CBA', 'NAB', 'BHP'] as const;

function sanitizeTicker(raw: string) {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function validateTicker(ticker: string): string {
  if (ticker.length < 3) return 'Ticker must be at least 3 characters';
  if (!/^[A-Z0-9]+$/.test(ticker)) return 'Ticker must be alphanumeric (A-Z, 0-9)';
  return '';
}

export default function CompanySearch({
  initialTicker,
  onSearch,
  loading,
}: {
  initialTicker: string;
  onSearch: (ticker: string) => void;
  loading: boolean;
}) {
  const [value, setValue] = useState(initialTicker);
  const [touched, setTouched] = useState(false);

  const normalized = useMemo(() => sanitizeTicker(value), [value]);
  const error = useMemo(() => (touched ? validateTicker(normalized) : ''), [touched, normalized]);

  function submit(ticker: string) {
    const t = sanitizeTicker(ticker);
    setValue(t);
    setTouched(true);

    const err = validateTicker(t);
    if (err) return;

    onSearch(t);
  }

  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-medium text-[#212529]" htmlFor="ticker">
        Search ASX ticker
      </label>

      <div className="flex gap-2">
        <div className="flex flex-1 items-center rounded-[6px] border border-[#e9ecef] bg-white px-3">
          <span className="text-sm font-semibold text-[#6c757d]">ASX</span>
          <span className="mx-2 h-5 w-px bg-[#e9ecef]" />
          <input
            id="ticker"
            value={value}
            onChange={(e) => setValue(sanitizeTicker(e.target.value))}
            onBlur={() => setTouched(true)}
            placeholder="CBA"
            className="w-full py-2 text-sm text-[#212529] outline-none placeholder:text-[#6c757d]"
            inputMode="text"
            autoComplete="off"
            disabled={loading}
          />
        </div>

        <button
          type="button"
          onClick={() => submit(value)}
          disabled={loading}
          className="rounded-[6px] bg-[#20705c] px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error ? <p className="mt-2 text-sm text-[#dc3545]">{error}</p> : null}

      <div className="mt-4">
        <p className="mb-2 text-sm text-[#6c757d]">Popular stocks:</p>
        <div className="flex flex-wrap gap-2">
          {POPULAR.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => submit(t)}
              disabled={loading}
              className="rounded-full border border-[#e9ecef] bg-white px-3 py-1 text-sm font-semibold text-[#212529] shadow-sm hover:bg-[#f8f9fa] disabled:opacity-60"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
