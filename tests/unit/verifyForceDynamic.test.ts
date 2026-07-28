/**
 * Issue #66 — verify/[id]/page.tsx must opt out of Next.js's default fetch
 * cache so that visitors always see the current on-chain state of a will.
 *
 * This test reads the source file directly (no build step required) and
 * confirms the route segment config export is present and correct.  The
 * same fs-based pattern is used in SEOMetadata.test.ts.
 */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const VERIFY_PAGE = path.join(
  process.cwd(),
  'src/app/verify/[id]/page.tsx',
);

describe('verify/[id]/page.tsx — route segment config (#66)', () => {
  it('contains the force-dynamic route segment config export', () => {
    const source = fs.readFileSync(VERIFY_PAGE, 'utf-8');
    // Match: export const dynamic = 'force-dynamic';
    // Allow single or double quotes and optional whitespace around the value.
    expect(source).toMatch(
      /export\s+const\s+dynamic\s*=\s*['"]force-dynamic['"]/,
    );
  });

  it('does NOT contain a static revalidate export that would re-enable caching', () => {
    const source = fs.readFileSync(VERIFY_PAGE, 'utf-8');
    // An active `revalidate` export on the same file would contradict the
    // force-dynamic intent.  Comments referencing the word are fine.
    const uncommentedLines = source
      .split('\n')
      .filter((line) => !line.trimStart().startsWith('//'))
      .join('\n');
    expect(uncommentedLines).not.toMatch(
      /export\s+const\s+revalidate\s*=/,
    );
  });

  it('the dynamic export appears before the first import statement', () => {
    const source = fs.readFileSync(VERIFY_PAGE, 'utf-8');
    const dynamicPos = source.search(/export\s+const\s+dynamic\s*=/);
    const firstImportPos = source.search(/^import\s/m);

    expect(dynamicPos).toBeGreaterThanOrEqual(0);
    expect(firstImportPos).toBeGreaterThanOrEqual(0);
    // Next.js resolves route segment config regardless of position, but
    // placing it before imports is the canonical convention and makes it
    // immediately visible to reviewers.
    expect(dynamicPos).toBeLessThan(firstImportPos);
  });
});
