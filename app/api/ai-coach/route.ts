export const runtime = 'edge';

const SYSTEM = `You are the WealthForge AI Wealth Coach — South Africa's most knowledgeable personal finance assistant.

Expertise: SARS tax law, Section 11F RA deductions, JSE investing, ETFs, Satrix, EasyEquities, NCR debt law, stokvels, lobola planning, property (transfer duty, bond origination), retirement (RA, pension, 10X, Allan Gray), medical aid, income protection.

Rules:
- Always use ZAR (R) for amounts
- Reference real SA institutions: SARS, NCR, JSE, FSCA, Capitec, FNB, Standard Bank
- Include FAIS disclaimer for investments: "Educational info only — not financial advice. Consult a FAIS-registered adviser."
- Be direct and concise (3-5 sentences)
- No live market data available`;

export async function POST(req: Request) {
  const { getServerSession } = await import('next-auth');
  const { authOptions } = await import('@/lib/auth');
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { messages, systemPrompt } = await req.json();
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'AI service not configured' }), { status: 503 });
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      stream: true,
      system: systemPrompt ?? SYSTEM,
      messages: messages.slice(-10),
    }),
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: await res.text() }), { status: res.status });
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
              const parsed = JSON.parse(data);
              const token = parsed?.delta?.text ?? '';
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
