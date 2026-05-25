import { createOpenAI } from '@ai-sdk/openai';
import { generateText, type ModelMessage } from 'ai';
import { ConvexHttpClient } from 'convex/browser';

import { runAgent } from '@/lib/agent/runner';
import type { ToolContext } from '@/lib/agent/type';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { inngest } from '../client';

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

const system = `
You are Volid's coding agent. Use tools to read/write files from Convex.
Always explain changes before applying them.
`;

const toModelMessage = (message: {
  role: 'user' | 'assistant' | 'system';
  content: string;
}): ModelMessage => {
  if (message.role === 'user') return { role: 'user', content: message.content };
  if (message.role === 'assistant') {
    return { role: 'assistant', content: message.content };
  }
  return { role: 'system', content: message.content };
};

export const runAgentFunction = inngest.createFunction(
  { id: 'run-agent', triggers: [{ event: 'agent/run.requested' }] },
  async ({ event, step }) => {
    const { runId, prompt, projectId, userId, enabledTools } = event.data;
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    await step.run('save-user-message', async () => {
      await convex.mutation(api.agentMemory.addMessage, {
        userId,
        projectId,
        role: 'user',
        content: prompt,
        runId,
      });
    });

    const memory = await step.run('load-project-memory', async () => {
      return await convex.query(api.agentMemory.getProjectMemory, {
        userId,
        projectId,
      });
    });

    const recentMessages = await step.run('load-recent-messages', async () => {
      return await convex.query(api.agentMemory.getRecentMessages, {
        userId,
        projectId,
        limit: 20,
      });
    });

    const result = await step.run('run-agent', async () => {
      const messages: ModelMessage[] = [
        { role: 'system', content: system },
        {
          role: 'system',
          content: `Project memory:\n${memory?.summary ?? 'No durable project memory yet.'}`,
        },
        ...recentMessages
          .filter(
            (
              message
            ): message is typeof message & {
              role: 'user' | 'assistant' | 'system';
            } => message.role !== 'tool'
          )
          .map(toModelMessage),
      ];

      return await runAgent({
        model: openrouter('openai/gpt-oss-120b'),
        messages,
        ctx: {
          userId,
          projectId: projectId as Id<'projects'>,
          convex,
        } satisfies ToolContext,
        enabledTools,
        config: {
          onEvent: async (agentEvent) => {
            if (
              agentEvent.type === 'tool_start' ||
              agentEvent.type === 'tool_end' ||
              agentEvent.type === 'tool_error'
            ) {
              await convex.mutation(api.agentMemory.addMessage, {
                userId,
                projectId,
                role: 'tool',
                content: JSON.stringify(agentEvent),
                runId,
              });
            }
          },
        },
      });
    });

    await step.run('save-assistant-message', async () => {
      await convex.mutation(api.agentMemory.addMessage, {
        userId,
        projectId,
        role: 'assistant',
        content: result,
        runId,
      });
    });

    await step.run('update-project-memory', async () => {
      const summaryResult = await generateText({
        model: openrouter('openai/gpt-oss-120b'),
        prompt: `
Update the durable memory for this coding agent project.

Keep only stable facts that will help future agent runs: architecture decisions, user preferences, important project context, unresolved tasks, and constraints.
Do not include transient tool logs, vague commentary, or details that are only useful for this single response.
Keep it concise and structured.

Previous memory:
${memory?.summary ?? 'No previous memory.'}

Latest user request:
${prompt}

Latest assistant result:
${result}

Updated memory:
`,
      });

      await convex.mutation(api.agentMemory.upsertProjectMemory, {
        userId,
        projectId,
        summary: summaryResult.text,
      });
    });

    return result;
  }
);
