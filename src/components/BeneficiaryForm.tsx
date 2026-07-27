'use client';

import type { Beneficiary } from '@sorowill/sdk';

export interface BeneficiaryFormProps {
  value: Beneficiary[];
  onChange: (beneficiaries: Beneficiary[]) => void;
}

function equalSplit(count: number): number[] {
  if (count === 0) {
    return [];
  }
  const base = Math.floor(100 / count);
  const remainder = 100 - base * count;
  return Array.from({ length: count }, (_, index) => base + (index < remainder ? 1 : 0));
}

export function BeneficiaryForm({ value, onChange }: BeneficiaryFormProps) {
  const total = value.reduce((sum, b) => sum + b.percentage, 0);
  const isValid = value.length > 0 && total === 100;

  function updateRow(index: number, patch: Partial<Beneficiary>) {
    onChange(value.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function addRow() {
    onChange([...value, { address: '', percentage: 0 }]);
  }

  function removeRow(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function applyEqualSplit() {
    const shares = equalSplit(value.length);
    onChange(value.map((row, i) => ({ ...row, percentage: shares[i] ?? 0 })));
  }

  return (
    <fieldset className="space-y-3">
      <div className="flex items-center justify-between">
        <legend className="text-sm font-semibold text-will-light">Beneficiaries</legend>
        <button
          type="button"
          onClick={applyEqualSplit}
          disabled={value.length === 0}
          aria-label="Distribute percentages equally among all beneficiaries"
          className="text-xs font-medium text-will-purple hover:underline disabled:opacity-40"
        >
          Split equally
        </button>
      </div>

      <div className="space-y-2" role="group" aria-label="Beneficiary list">
        {value.map((beneficiary, index) => (
          <div key={index} className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <label htmlFor={`beneficiary-address-${index}`} className="sr-only">
                Beneficiary {index + 1} address
              </label>
              <input
                id={`beneficiary-address-${index}`}
                type="text"
                placeholder="Stellar address (G...)"
                value={beneficiary.address}
                onChange={(event) => updateRow(index, { address: event.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm text-will-light placeholder:text-will-light/40 focus:border-will-purple focus:outline-none"
              />
            </div>
            <div className="flex items-end gap-1">
              <div>
                <label htmlFor={`beneficiary-percentage-${index}`} className="sr-only">
                  Beneficiary {index + 1} percentage
                </label>
                <input
                  id={`beneficiary-percentage-${index}`}
                  type="number"
                  min={0}
                  max={100}
                  value={beneficiary.percentage}
                  onChange={(event) =>
                    updateRow(index, { percentage: Number(event.target.value) || 0 })
                  }
                  className="w-20 rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-right text-sm text-will-light focus:border-will-purple focus:outline-none"
                />
              </div>
              <span className="text-sm text-will-light/60 pb-2">%</span>
            </div>
            <button
              type="button"
              onClick={() => removeRow(index)}
              aria-label={`Remove beneficiary ${index + 1}`}
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
        className="w-full rounded-lg border border-dashed border-white/20 py-2 text-sm text-will-light/70 transition hover:border-will-purple hover:text-will-light"
      >
        + Add beneficiary
      </button>

      <div className={`text-sm ${isValid ? 'text-emerald-400' : 'text-amber-400'}`} role="status" aria-live="polite">
        Total: {total}% {isValid ? '✓' : '(must equal 100%)'}
      </div>
    </fieldset>
  );
}
