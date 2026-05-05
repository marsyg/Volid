// src/inngest/functions.ts

import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { inngest } from '../client';

const prompt = `
You are an advanced AI coding assistant specialized in inline autocompletion.

Given the code before and after the cursor, predict the most likely continuation exactly at the cursor position.

Guidelines:
- Only generate the missing code at the cursor.
- Do not repeat existing code from before or after.
- Do not include explanations or comments.
- Ensure the completion fits seamlessly between the given contexts.
- Match indentation, formatting, and style exactly.
- Use idiomatic patterns of the language.
- Prefer the most likely and concise completion.

Language: <language>

Code Before Cursor:
<Before>

Code After Cursor:
<After>

Cursor:
<|>

Completion:
`;
export const provideInlineCompletion = inngest.createFunction(
  {
    id: 'provide-inline-completion',
    triggers: [{ event: 'editor/inline-completion.requested' }],
    },    
    async ({ step, event }) => {
        console.log("this is event triggeres",event)
      console.log("event.data", event.data);
    const { languageId, code, postion } = event.data;
    const codeBeforeCursor = code.codeBeforeCursor;
    const codeAfterCursor = code.codeAfterCursor;

    const fullPrompt = prompt
      .replace('<language>', languageId)
      .replace('<Before>', codeBeforeCursor)
      .replace('<After>', codeAfterCursor);

    return await step.run('handle-task', async () => {
      return await generateText({
        model: google('gemini-2.5-flash'),
        prompt: fullPrompt,
      });
    });
  },
);
