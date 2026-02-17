'use client';

import type { ComparisonState, TickerItemState } from '@/types';

function formatNumber(n: number) {
  return new Intl.NumberFormat().format(n);
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function isReady(item: TickerItemState) {
  return !item.loading && !item.error && item.companyData && item.quoteData;
}

type Extrema = { min: number; max: number } | null;

function getExtrema(values: Array<number | null | undefined>): Extrema {
  const nums = values.filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
  if (nums.length < 2) return null;
  let min = nums[0];
  let max = nums[0];
  for (const n of nums) {
    if (n < min) min = n;
    if (n > max) max = n;
  }
  if (min === max) return null;
  return { min, max };
}

function Badge({ kind }: { kind: 'high' | 'low' }) {
  const base = 'ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold';
  if (kind === 'high') {
    return <span className={`${base} bg-[#e7f5ef] text-[#20705c]`}>High</span>;
  }
  return <span className={`${base} bg-[#fdecec] text-[#dc3545]`}>Low</span>;
}

function Cell({
  item,
  children,
  badge,
  highlight,
}: {
  item: TickerItemState;
  children?: React.ReactNode;
  badge?: 'high' | 'low';
  highlight?: boolean;
}) {
  if (item.loading) return <span className="text-sm text-[#6c757d]">Loading…</span>;
  if (item.error) return <span className="text-sm text-[#dc3545]">{item.error}</span>;
  if (!item.companyData || !item.quoteData) return <span className="text-sm text-[#6c757d]">—</span>;

  return (
    <span className={highlight ? 'rounded-[6px] bg-[#f8f9fa] px-2 py-1' : undefined}>
      {children}
      {badge ? <Badge kind={badge} /> : null}
    </span>
  );
}

type MetricRow = {
  key: string;
  label: string;
  getValue: (item: TickerItemState) => number | null;
  render: (item: TickerItemState) => React.ReactNode;
  comparable: boolean;
};

export default function ComparisonTable({
  tickers,
  byTicker,
}: Pick<ComparisonState, 'tickers' | 'byTicker'>) {
  const showBadges = tickers.length >= 2;

  if (tickers.length === 0) {
    return (
      <div className="rounded-[8px] border border-[#e9ecef] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        <p className="text-sm text-[#6c757d]">Add up to 5 tickers to compare side-by-side.</p>
      </div>
    );
  }

  const rows: MetricRow[] = [
    {
      key: 'price',
      label: 'Current Price',
      comparable: true,
      getValue: (item) => (isReady(item) ? item.quoteData!.quote.cf_last : null),
      render: (item) => formatCurrency(item.quoteData!.quote.cf_last),
    },
    {
      key: 'change',
      label: 'Change',
      comparable: true,
      getValue: (item) => (isReady(item) ? item.quoteData!.quote.cf_netchng : null),
      render: (item) => {
        const v = item.quoteData!.quote.cf_netchng;

        let arrow = '→';
        let color = 'text-[#6c757d]';

        if (v > 0) {
        arrow = '↑';
        color = 'text-[#198754]';
        } else if (v < 0) {
        arrow = '↓';
        color = 'text-[#dc3545]';
        }

        return (
        <span className={`font-semibold ${color}`}>
            {arrow} {formatCurrency(v)}
        </span>
        );
      },
    },
    {
      key: 'pct',
      label: 'Change (%)',
      comparable: true,
      getValue: (item) => (isReady(item) ? item.quoteData!.quote.pctchng : null),
      render: (item) => {
        const v = item.quoteData!.quote.pctchng;

        let arrow = '→';
        let color = 'text-[#6c757d]';

        if (v > 0) {
        arrow = '↑';
        color = 'text-[#198754]';
        } else if (v < 0) {
        arrow = '↓';
        color = 'text-[#dc3545]';
        }

        return (
        <span className={`font-semibold ${color}`}>
            {arrow} {formatCurrency(v)}%
        </span>
        );
      },
    },
    {
      key: 'volume',
      label: 'Volume',
      comparable: true,
      getValue: (item) => (isReady(item) ? item.quoteData!.quote.cf_volume : null),
      render: (item) => formatNumber(item.quoteData!.quote.cf_volume),
    },
    {
      key: 'mkt',
      label: 'Market Value',
      comparable: true,
      getValue: (item) => (isReady(item) ? item.quoteData!.quote.mkt_value : null),
      render: (item) => formatNumber(item.quoteData!.quote.mkt_value),
    },
    {
      key: '52w',
      label: '52 Week High',
      comparable: true,
      getValue: (item) => (isReady(item) ? item.quoteData!.quote['52wk_high'] : null),
      render: (item) => formatCurrency(item.quoteData!.quote['52wk_high']),
    },
    {
      key: 'info',
      label: 'Company Info',
      comparable: false, // ✅ 不参与高低标记
      getValue: () => null,
      render: (item) => <span className="text-sm text-[#212529]">{item.companyData!.company_info}</span>,
    },
  ];

  const extremaByRowKey: Record<string, Extrema> = {};
  for (const row of rows) {
    if (!row.comparable || !showBadges) {
      extremaByRowKey[row.key] = null;
      continue;
    }
    const values = tickers.map((t) => row.getValue(byTicker[t]));
    extremaByRowKey[row.key] = getExtrema(values);
  }

  return (
    <div className="overflow-x-auto rounded-[8px] border border-[#e9ecef] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-[#e9ecef] bg-[#f8f9fa]">
            <th className="px-4 py-3 text-left text-sm font-semibold text-[#212529]">Metric</th>
            {tickers.map((t) => (
              <th key={t} className="min-w-[180px] px-4 py-3 text-left text-sm font-semibold text-[#212529]">
                {t}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => {
            const extrema = extremaByRowKey[row.key];

            return (
              <tr key={row.key} className="border-b border-[#e9ecef] last:border-b-0">
                <td className="px-4 py-3 text-sm font-medium text-[#6c757d]">{row.label}</td>

                {tickers.map((t) => {
                  const item = byTicker[t];
                  const v = row.getValue(item);
                  const badge =
                    extrema && typeof v === 'number'
                      ? v === extrema.max
                        ? 'high'
                        : v === extrema.min
                          ? 'low'
                          : undefined
                      : undefined;

                  const highlight = Boolean(badge);

                  return (
                    <td key={t} className="px-4 py-3 align-top">
                      <Cell
                        item={item}
                        badge={badge}
                        highlight={highlight}
                      >
                        {isReady(item) ? row.render(item) : null}
                      </Cell>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
