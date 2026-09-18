import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { calculateScore } from '../src/lib/health-check/domain.ts';

const fixtures = JSON.parse(readFileSync(new URL('./fixtures/health-check.json', import.meta.url)));
for (const fixture of fixtures) {
  test(`scoring matches pre-refactor output: ${fixture.name}`, () => {
    assert.deepEqual(calculateScore(fixture.answers), fixture.expected);
  });
}
