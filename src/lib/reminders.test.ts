import assert from 'node:assert/strict';

import { getReminderKind } from './reminders';

function runTests() {
  assert.equal(getReminderKind(30), 'well-before');
  assert.equal(getReminderKind(14), 'imminent');
  assert.equal(getReminderKind(7), 'imminent');
  assert.equal(getReminderKind(0), 'imminent');
  assert.equal(getReminderKind(-1), 'imminent');
}

runTests();
console.log('Reminder helper tests passed');
