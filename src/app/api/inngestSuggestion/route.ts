import { serve } from 'inngest/next';
import { inngest } from '@/inngest/client';

import { provideInlineCompletion } from '@/inngest/functions/provideInlineCompleletion';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [provideInlineCompletion],
});
