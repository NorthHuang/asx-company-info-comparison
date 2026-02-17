'use client';

import type { ComparisonState, TickerItemState } from '@/types';

function formatNumber(n: number) {
  return new Intl.NumberFormat().format(n);
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

function cellContent(item: TickerItemState, render: () => React.ReactNode) {
  if (item.loading) return <span className="text-sm text-[#6c757d]">Loading…</span>;
  if (item.error) return <span className="text-sm text-[#dc3545]">{item.error}</span>;
  if (!item.companyData || !item.quoteData) return <span className="text-sm text-[#6c757d]">—</span>;
  return render();
}

export default function ComparisonTable({
  tickers,
  byTicker,
}: Pick<ComparisonState, 'tickers' | 'byTicker'>) {
  if (tickers.length === 0) {
    return (
      <div className="rounded-[8px] border border-[#e9ecef] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        <p className="text-sm text-[#6c757d]">
          Add up to 5 tickers to compare side-by-side.
        </p>
      </div>
    );
  }

  const rows: { label: string; render: (item: TickerItemState) => React.ReactNode }[] = [
    {
      label: 'Current Price',
      render: (item) =>
        cellContent(item, () => formatCurrency(item.quoteData!.quote.cf_last)),
    },
    {
      label: 'Change',
      render: (item) =>
        cellContent(item, () => {
          const v = item.quoteData!.quote.cf_netchng;
          const cls = v >= 0 ? 'text-[#198754]' : 'text-[#dc3545]';
          return <span className={`font-semibold ${cls}`}>{formatCurrency(v)}</span>;
        }),
    },
    {
      label: 'Change (%)',
      render: (item) =>
        cellContent(item, () => {
          const v = item.quoteData!.quote.pctchng;
          const cls = v >= 0 ? 'text-[#198754]' : 'text-[#dc3545]';
          return <span className={`font-semibold ${cls}`}>{formatCurrency(v)}%</span>;
        }),
    },
    {
      label: 'Volume',
      render: (item) =>
        cellContent(item, () => formatNumber(item.quoteData!.quote.cf_volume)),
    },
    {
      label: 'Market Value',
      render: (item) =>
        cellContent(item, () => formatNumber(item.quoteData!.quote.mkt_value)),
    },
    {
      label: '52 Week High',
      render: (item) =>
        cellContent(item, () => formatCurrency(item.quoteData!.quote['52wk_high'])),
    },
    {
      label: 'Company Info',
      render: (item) =>
        cellContent(item, () => (
          <span className="text-sm text-[#212529]">
            {item.companyData!.company_info}
          </span>
        )),
    },
  ];

  return (
    <div className="overflow-x-auto rounded-[8px] border border-[#e9ecef] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-[#e9ecef] bg-[#f8f9fa]">
            <th className="px-4 py-3 text-left text-sm font-semibold text-[#212529]">
              Metric
            </th>
            {tickers.map((t) => (
              <th
                key={t}
                className="min-w-[180px] px-4 py-3 text-left text-sm font-semibold text-[#212529]"
              >
                {t}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-[#e9ecef] last:border-b-0">
              <td className="px-4 py-3 text-sm font-medium text-[#6c757d]">
                {row.label}
              </td>
              {tickers.map((t) => (
                <td key={t} className="px-4 py-3 align-top">
                  {row.render(byTicker[t])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
