import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const enabledTools = [
  "listFile",
  "readFile",
  "writeFile",
  "searchFile",
  "createFile",
  "createDirectory",
];

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return NextResponse.json({ error: "Convex is not configured" }, { status: 500 });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "OpenRouter is not configured" }, { status: 500 });
  }

  const { prompt, projectId } = await req.json();

  if (typeof prompt !== "string" || !prompt.trim()) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  if (typeof projectId !== "string" || !projectId) {
    return NextResponse.json({ error: "Project id is required" }, { status: 400 });
  }

  const runId = await convex.mutation(api.agentRun.createAgentRun, {
    userId,
    projectId: projectId as Id<"projects">,
    prompt: prompt.trim(),
  });

  await inngest.send({
    name: "agent/run.requested",
    data: {
      runId,
      prompt: prompt.trim(),
      projectId: projectId as Id<"projects">,
      userId,
      enabledTools,
    },
  });

  return NextResponse.json({ queued: true, runId });
}
