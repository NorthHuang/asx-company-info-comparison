export default function LoadingSpinner({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-[#6c757d]">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#e9ecef] border-t-[#20705c]" />
      <span className="text-sm">{text}</span>
    </div>
  );
}
