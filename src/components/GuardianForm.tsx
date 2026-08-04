'use client';

const MAX_GUARDIANS = 5;

export interface GuardianFormProps {
  guardians: string[];
  onChange: (guardians: string[]) => void;
}

export function GuardianForm({ guardians, onChange }: GuardianFormProps) {
  const isMaxReached = guardians.length >= MAX_GUARDIANS;

  function updateRow(index: number, value: string) {
    onChange(guardians.map((g, i) => (i === index ? value : g)));
  }

  function addRow() {
    if (!isMaxReached) {
      onChange([...guardians, '']);
    }
  }

  function removeRow(index: number) {
    onChange(guardians.filter((_, i) => i !== index));
  }

  return (
    <fieldset className="space-y-3">
      <div className="flex items-center justify-between">
        <legend className="text-sm font-semibold text-will-light">Guardians</legend>
        <span className="text-xs text-will-light/60">
          {guardians.length} guardians
        </span>
      </div>

      <div className="space-y-2" role="group" aria-label="Guardian list">
        {guardians.map((guardian, index) => (
          <div key={index} className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <label htmlFor={`guardian-address-${index}`} className="sr-only">
                Guardian {index + 1} address
              </label>
              <input
                id={`guardian-address-${index}`}
                type="text"
                placeholder="Stellar address (G...)"
                value={guardian}
                onChange={(event) => updateRow(index, event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm text-will-light placeholder:text-will-light/40 focus:border-will-purple focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => removeRow(index)}
              aria-label={`Remove guardian ${index + 1}`}
              className="rounded-lg border border-white/10 px-2 py-2 text-will-light/60 transition hover:border-red-400/40 hover:text-red-400"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        disabled={isMaxReached}
        className="w-full rounded-lg border border-dashed border-white/20 py-2 text-sm text-will-light/70 transition hover:border-will-purple hover:text-will-light disabled:opacity-40 disabled:cursor-not-allowed"
      >
        + Add guardian
      </button>

      {isMaxReached && (
        <p className="text-xs text-amber-400" role="status">
          You can add up to {MAX_GUARDIANS} guardians. Maximum reached.
        </p>
      )}
    </fieldset>
  );
}
