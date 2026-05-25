import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

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

  const { prompt, projectId } = await req.json();

  const runId = await convex.mutation(api.agentRun.createAgentRun, {
    userId,
    projectId,
    prompt,
  });

  await inngest.send({
    name: "agent/run.requested",
    data: {
      runId,
      prompt,
      projectId,
      userId,
      enabledTools,
    },
  });

  return NextResponse.json({ queued: true, runId });
}
