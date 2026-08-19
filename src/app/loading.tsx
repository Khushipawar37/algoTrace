export default function Loading() {
  return (
    <div className="min-h-screen bg-floral text-smoky flex items-center justify-center font-mono text-xs">
      <div className="flex items-center gap-3 p-6 rounded-[24px] border border-smoky/15 bg-bone/20">
        <span className="w-2.5 h-2.5 rounded-full bg-smoky animate-pulse" />
        <span>Loading AlgoTrace...</span>
      </div>
    </div>
  );
}
