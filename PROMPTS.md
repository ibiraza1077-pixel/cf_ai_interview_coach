# Interview prompt

The source of truth is `SYSTEM_PROMPT` in `src/index.ts`. It asks the model to establish the candidate's role and background, ask technical/coding/system-design/behavioural questions one at a time, and provide constructive feedback.

The current model call uses a 512-token output limit and temperature 0.7. The server retains the system prompt and a bounded recent message window; old answers are eventually dropped. User messages are passed as user-role messages, never interpolated into the system prompt.

This prompt does not measure employability or guarantee factual correctness. Model output is practice feedback, not a hiring decision. Regression tests check context retention; they do not evaluate model answer quality.
