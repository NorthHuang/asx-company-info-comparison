'use client';

export default function TickerPills({
  tickers,
  onRemove,
  disabled,
}: {
  tickers: string[];
  onRemove: (ticker: string) => void;
  disabled?: boolean;
}) {
  if (tickers.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tickers.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-2 rounded-full border border-[#e9ecef] bg-white px-3 py-1 text-sm font-semibold text-[#212529] shadow-sm"
        >
          {t}
          <button
            type="button"
            onClick={() => onRemove(t)}
            disabled={disabled}
            aria-label={`Remove ${t} from comparison`}
            className="rounded-full px-2 text-[#6c757d] hover:bg-[#f8f9fa] disabled:opacity-60"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}
