import { xai } from '@ai-sdk/xai';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';
import { openrouter } from '@/lib/openRouter';

const prompt = `
You are an advanced AI coding assistant specialized in inline autocompletion.

Given the code before and after the cursor, predict the most likely continuation exactly at the cursor position.

Guidelines:
- Only generate the missing code at the cursor.
- Do not repeat existing code from before or after.
- Do not include explanations or comments.
- Ensure the completion fits seamlessly between the given contexts.
- Match indentation, formatting, and style exactly.
- Use idiomatic patterns of the language.
- Prefer the most likely and concise completion.

Language: <language>

Code Before Cursor:
<Before>

Code After Cursor:
<After>

Completion:
`;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}

export async function POST(req: Request) {
  console.log('process.env.XAI_API_KEY', process.env.XAI_API_KEY);
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        {
          error: 'Missing OPENROUTER_API_KEY',
          items: [],
        },
        { status: 500 },
      );
    }
    console.log(
      process.env.OPENROUTER_API_KEY,
      'process.env.OPENROUTER_API_KEY',
    );
    const { code, languageId } = await req.json();
    console.log(code, languageId);
    if (!code || !languageId) {
      return NextResponse.json(
        {
          error: 'Missing code or languageId',
          items: [],
        },
        { status: 400 },
      );
    }
    
    const fullPrompt = prompt
      .replace('<language>', languageId)
      .replace('<Before>', code.beforeCursor ?? '')
      .replace('<After>', code.afterCursor ?? '');

    const result = await openrouter.chat.send({
      chatRequest: {
        model: 'openai/gpt-oss-120b',
        messages: [
          {
            role: 'user',
            content: fullPrompt,
          },
        ],
      },
    });

    return NextResponse.json({
      items: [
        {
          insertText: result.choices[0].message.content,
        },
      ],
    });
  } catch (error) {
    console.error('Inline completion failed', error);

    return NextResponse.json(
      {
        error: 'Inline completion failed',
        detail: getErrorMessage(error),
        items: [],
      },
      { status: 500 },
    );
  }
}
