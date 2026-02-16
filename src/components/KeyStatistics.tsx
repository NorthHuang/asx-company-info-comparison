import type { QuoteData } from '@/types';

function formatAud(value: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-AU').format(value);
}

function formatMarketValue(value: number) {
  const billions = value / 1_000_000_000;
  if (billions >= 1) return `${billions.toFixed(2)}B`;
  const millions = value / 1_000_000;
  if (millions >= 1) return `${millions.toFixed(2)}M`;
  return formatNumber(value);
}

export default function KeyStatistics({ quoteData }: { quoteData: QuoteData }) {
  const q = quoteData.quote;
  const isUp = q.cf_netchng >= 0;
  const changeColor = isUp ? 'text-[#198754]' : 'text-[#dc3545]';
  const sign = isUp ? '+' : '';

  return (
    <div className="rounded-[8px] border border-[#e9ecef] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
      <h2 className="text-base font-semibold text-[#212529]">Key Statistics</h2>
      <div className="mt-4 space-y-3 text-sm font-semibold">
        <div className="flex items-center justify-between">
          <span className="text-[#6c757d]">Current Price</span>
          <span className="text-[#212529]">{formatAud(q.cf_last)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#6c757d]">Change</span>
          <span className={changeColor}>
            {sign}
            {formatAud(q.cf_netchng)} ({sign}
            {q.pctchng.toFixed(2)}%)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#6c757d]">Volume</span>
          <span className="text-[#212529]">{formatNumber(q.cf_volume)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#6c757d]">Market Value</span>
          <span className="text-[#212529]">{formatMarketValue(q.mkt_value)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#6c757d]">52W High</span>
          <span className="text-[#212529]">{formatAud(q['52wk_high'])}</span>
        </div>
      </div>
    </div>
  );
}
