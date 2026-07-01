// src/app/api/openrouter-check/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    return NextResponse.json(
      { ok: false, error: "OPENROUTER_API_KEY not set" },
      { status: 500 }
    );
  }

  try {
    const resp = await fetch("https://openrouter.ai/api/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        input: "ping",
        max_output_tokens: 1,
      }),
    });

    const headers = Object.fromEntries(resp.headers.entries());
    const text = await resp.text();
    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }

    return NextResponse.json(
      {
        ok: resp.ok,
        status: resp.status,
        responseHeaders: headers,
        body,
      },
      { status: resp.ok ? 200 : 502 }
    );
  } catch (err) {
    console.error("/api/openrouter-check error:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
