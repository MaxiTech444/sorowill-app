export default function NewWillLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-3">
        <div className="skeleton h-8 w-40" />
        <div className="skeleton h-4 w-32" />
        <div className="skeleton h-1.5 w-full rounded-full" />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="space-y-4">
          <div>
            <div className="skeleton h-4 w-32 mb-2" />
            <div className="skeleton h-10 w-full rounded-lg" />
          </div>
          <div>
            <div className="skeleton h-4 w-28 mb-2" />
            <div className="skeleton h-10 w-full rounded-lg" />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="skeleton h-10 w-20 rounded-full" />
        <div className="skeleton h-10 w-20 rounded-full" />
      </div>
    </div>
  );
}
