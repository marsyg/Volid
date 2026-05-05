// src/inngest/functions.ts

import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { inngest } from '../client';
export const processTask = inngest.createFunction(
  { id: 'demo-generate', triggers: { event: 'demo/task.created' } },
  async ({ step }) => {
    await step.run('handle-task', async () => {
      return await generateText({
        model: google('gemini-2.5-flash'),
        prompt: 'write a vegeterian reciepe',
      });
    });
  },
);
