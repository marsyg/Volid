import { generateText, type LanguageModel, type ModelMessage, ToolSet } from 'ai';
import { executeTools } from './execute';
import { TOOL_REGISTRY } from './tool';
import { RunnerEvent, ToolContext } from './type';

interface RunnerConfig {
  maxTurns?: number;

  onEvent?: (e: RunnerEvent) => void | Promise<void>;
}
export async function runAgent({
  model,
  messages,
  ctx,
  enabledTools,
  config,
}: {
  model: LanguageModel;
  messages: ModelMessage[];
  ctx: ToolContext;
  enabledTools: string[];
  config?: RunnerConfig;
}) {
  // todo - add a condition in allowedTools to check if there's at least one enabled tool
  const allowedTools = Object.fromEntries(
    Object.entries(TOOL_REGISTRY).filter(([name]) => enabledTools.includes(name))
  );
  const emit = async (e: RunnerEvent) => {
    await config?.onEvent?.(e);
  };
  const maxTurns = config?.maxTurns ?? 10;

  for (let turn = 1; turn <= maxTurns; turn++) {
    await emit({ type: 'llm_call', turn });
    const result = await generateText({
      model,
      messages,
      tools: Object.fromEntries(
        Object.entries(allowedTools).map(([name, tool]) => [
          name,
          {
            description: tool.description,
            inputSchema: tool.inputSchema,
          },
        ])
      ) satisfies ToolSet,
    });
    if (!result.toolCalls.length) {
      await emit({ type: 'done', text: result.text, turns: turn });
      return result.text;
    }

    messages.push(...result.response.messages);
    const toolResultParts = await executeTools(result.toolCalls, allowedTools, ctx, emit);
    messages.push({
      role: 'tool',
      content: toolResultParts,
    });
  }

  throw new Error(`Agent exceeded max turns (${maxTurns})`);
}
