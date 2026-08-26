import { NextResponse }    from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions }      from '@/lib/auth';

// Node.js runtime (not edge) — next-auth requires crypto which is Node-only
const SYSTEM = `You are the WealthForge AI Wealth Coach — South Africa's most knowledgeable personal finance assistant.

Expertise: SARS tax law, Section 11F RA deductions, JSE investing, ETFs, Satrix, EasyEquities, NCR debt law, stokvels, lobola planning, property (transfer duty, bond origination), retirement (RA, pension, 10X, Allan Gray), medical aid, income protection.

Rules:
- Always use ZAR (R) for amounts
- Reference real SA institutions: SARS, NCR, JSE, FSCA, Capitec, FNB, Standard Bank
- For investment questions add: "Educational info only — not financial advice. Consult a FAIS-registered adviser."
- Be direct and concise (3-5 sentences unless detail is needed)
- No live market data available`;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { messages, systemPrompt } = await req.json();
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
  }
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6', max_tokens: 1024, stream: true,
      system: systemPrompt ?? SYSTEM,
      messages: (messages as any[]).slice(-10),
    }),
  });
  if (!res.ok || !res.body) {
    return NextResponse.json({ error: await res.text() }, { status: res.status });
  }
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (data === '[DONE]') { controller.enqueue(encoder.encode('data: [DONE]\n\n')); continue; }
            try {
              const token = JSON.parse(data)?.delta?.text ?? '';
              if (token) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: { text: token } })}\n\n`));
            } catch { /* skip */ }
          }
        }
      } finally { controller.close(); }
    },
  });
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  });
}
