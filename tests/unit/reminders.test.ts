import { describe, it, expect } from 'vitest';
import { getReminderKind } from '@/lib/reminders';

describe('getReminderKind', () => {
  it('returns well-before for 30 days remaining', () => {
    expect(getReminderKind(30)).toBe('well-before');
  });

  it('returns imminent for 14 days remaining', () => {
    expect(getReminderKind(14)).toBe('imminent');
  });

  it('returns imminent for 7 days remaining', () => {
    expect(getReminderKind(7)).toBe('imminent');
  });

  it('returns imminent for 0 days remaining', () => {
    expect(getReminderKind(0)).toBe('imminent');
  });

  it('returns imminent for negative days remaining', () => {
    expect(getReminderKind(-1)).toBe('imminent');
  });
});
