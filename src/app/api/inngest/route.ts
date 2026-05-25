import { serve } from 'inngest/next';
import { inngest } from '@/inngest/client';
import { processTask } from '@/inngest/functions/functions';
import { provideInlineCompletion } from '@/inngest/functions/provideInlineCompleletion';
import { runAgentFunction } from '@/inngest/functions/runAgent';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processTask, provideInlineCompletion, runAgentFunction],
});
