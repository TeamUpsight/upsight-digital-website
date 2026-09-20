import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { calculateScore, getQuestionProgress, questions } from '../src/lib/health-check/domain.ts';

const fixtures = JSON.parse(readFileSync(new URL('./fixtures/health-check.json', import.meta.url)));
for (const fixture of fixtures) {
  test(`scoring totals remain stable when recommendation wording changes: ${fixture.name}`, () => {
    const result = calculateScore(fixture.answers);
    assert.equal(result.total, fixture.expected.total);
    assert.deepEqual(result.breakdown, fixture.expected.breakdown);
    assert.deepEqual(result.percentages, fixture.expected.percentages);
    assert.equal(result.maturity, fixture.expected.maturity);
    assert.deepEqual(result.risks.map(risk => risk.category), fixture.expected.risks.map(risk => risk.category));
    assert.deepEqual(result.recommendations.map(recommendation => recommendation.category), fixture.expected.recommendations.map(recommendation => recommendation.category));
  });
}

for (const platform of ['Website Only', 'Mobile app', 'Both']) {
  test(`${platform} progress is monotonic across its full conditional path`, () => {
    const answers = { q2: platform };
    const values = questions.filter(question => !question.condition || question.condition(answers)).map(question => getQuestionProgress(question.id));
    assert.equal(values.at(-1), 100);
    for (let index = 1; index < values.length; index++) assert.ok(values[index] >= values[index - 1]);
  });
}
