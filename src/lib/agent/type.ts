import type { ConvexHttpClient } from 'convex/browser';
import { z } from 'zod';
import { Id } from '../../../convex/_generated/dataModel';

export type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };

export type ToolResult<T extends JsonValue = JsonValue> = ToolOk<T> | ToolErr;

export type ToolContext = {
  userId: string;
  projectId: Id<'projects'>;
  convex: ConvexHttpClient;
};

export type ToolDefinition<
  S extends z.ZodTypeAny = z.ZodTypeAny,
  T extends JsonValue = JsonValue,
> = {
  name: string;
  description: string;
  inputSchema: S;
  execute: (ctx: ToolContext, input: z.infer<S>) => Promise<ToolResult<T>>;
};
export type ToolOk<T extends JsonValue = JsonValue> = { ok: true; data: T };
export type ToolErr = { ok: false; error: string };

export type ToolRegistry = Record<string, ToolDefinition>;

export type RunnerEvent =
  | { type: 'llm_call'; turn: number }
  | { type: 'tool_start'; name: string; input: unknown }
  | { type: 'tool_end'; name: string; result: ToolResult }
  | { type: 'tool_error'; name: string; error: string }
  | { type: 'done'; text: string; turns: number };
