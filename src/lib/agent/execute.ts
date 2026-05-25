
// tool execution — validate → run → format result parts
//  runner.ts stays focused on loop control

import type { ToolCallPart, ToolResultPart } from 'ai';
import type { ToolDefinition, ToolContext, RunnerEvent, ToolRegistry } from './type';
import { TOOL_REGISTRY } from './tool';

export async function executeTools(
  calls: ToolCallPart[],
  tools: ToolRegistry,
  ctx: ToolContext,
  emit: (e: RunnerEvent) => void | Promise<void>,
): Promise<ToolResultPart[]> {
  return Promise.all(calls.map((call) => executeSingle(call, tools, ctx, emit)));
}

async function executeSingle(
  call: ToolCallPart,
  tools: ToolRegistry,
  ctx: ToolContext,
  emit: (e: RunnerEvent) => void | Promise<void>,
): Promise<ToolResultPart> {
  const { toolCallId, toolName, input } = call;
  const def = tools[toolName];


  if (!def) {
    const error = `Unknown tool: ${toolName}`;
    await emit({ type: "tool_error", name: toolName, error });
    return errPart(toolCallId, toolName, error);
  }

  
  const parsed = def.inputSchema.safeParse(input);
  if (!parsed.success) {
    const error = `Invalid args for ${toolName}: ${parsed.error.message}`;
    await emit({ type: "tool_error", name: toolName, error });
    return errPart(toolCallId, toolName, error);
  }

  await emit({ type: "tool_start", name: toolName, input: parsed.data });

  try {
    const result = await def.execute(ctx, parsed.data);
    await emit({ type: "tool_end", name: toolName, result });

    return result.ok
      ? { type: "tool-result", toolCallId, toolName, output: { type: "json",       value: result.data  } }
      : { type: "tool-result", toolCallId, toolName, output: { type: "error-text", value: result.error } };

  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    await emit({ type: "tool_error", name: toolName, error });
    return errPart(toolCallId, toolName, `Tool threw unexpectedly: ${error}`);
  }
}

// helper

function errPart(toolCallId: string, toolName: string, value: string): ToolResultPart {
  return { type: "tool-result", toolCallId, toolName, output: { type: "error-text", value } };
}
