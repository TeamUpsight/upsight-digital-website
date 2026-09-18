import { z } from 'zod';
import { protectionFields } from '../submission-security';
import { isValidUrl, questions } from './domain';

const answerSchema = z.record(z.string().max(12), z.union([
  z.string().max(2048), z.array(z.string().max(120)).min(1).max(6),
])).superRefine((answers, ctx) => {
  const allowed = new Set(questions.map(q => q.id));
  if (Object.keys(answers).length > questions.length || Object.keys(answers).some(key => !allowed.has(key))) {
    ctx.addIssue({ code: 'custom', message: 'Unknown answers.' });
  }
  for (const question of questions) {
    const answer = answers[question.id];
    if (question.condition && !question.condition(answers)) {
      if (answer !== undefined) ctx.addIssue({ code: 'custom', path: [question.id], message: 'Inactive question.' });
      continue;
    }
    const options = question.options?.map(option => option.value) ?? [];
    const valid = question.type === 'input' ? typeof answer === 'string' && isValidUrl(answer)
      : question.type === 'single' ? typeof answer === 'string' && options.includes(answer)
      : Array.isArray(answer) && answer.length > 0 && new Set(answer).size === answer.length && answer.every(value => options.includes(value));
    if (!valid) ctx.addIssue({ code: 'custom', path: [question.id], message: 'Please answer this question.' });
  }
});

// Report fields are deliberately not accepted: only the server may derive them.
export const healthSubmissionSchema = z.strictObject({
  email: z.string().trim().max(254).pipe(z.email()),
  answers: answerSchema,
  ...protectionFields,
});
