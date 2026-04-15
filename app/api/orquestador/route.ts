import { NextResponse, type NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buscarContexto, formatContexto } from '@/lib/ia/rag';
import { searchWeb } from '@/lib/ia/search';
import { SYSTEM_ORQUESTADOR } from '@/lib/ia/prompts';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MODEL = 'claude-sonnet-4-5-20250929';
const MAX_TOKENS = 1024;

const TOOLS: Anthropic.Tool[] = [
  {
    name: 'search_web',
    description:
      'Verifica en internet si una ley, decreto o resolución colombiana sigue vigente, fue derogada o modificada. Usa consultas específicas con número y año de la norma.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Consulta web específica (ej. "Ley 1952 de 2019 vigencia derogatoria")' },
      },
      required: ['query'],
    },
  },
];

interface Body {
  pregunta: string;
  diagnostico?: unknown;
}

export async function POST(request: NextRequest) {
  const { pregunta, diagnostico } = (await request.json()) as Body;
  if (!pregunta?.trim()) {
    return NextResponse.json({ error: 'Falta pregunta' }, { status: 400 });
  }

  const chunks = await buscarContexto(pregunta, 4);
  const contextoRAG = formatContexto(chunks);

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const system: Anthropic.TextBlockParam[] = [
    { type: 'text', text: SYSTEM_ORQUESTADOR, cache_control: { type: 'ephemeral' } },
    {
      type: 'text',
      text: `Contexto RAG (corpus PGN):\n\n${contextoRAG}`,
      cache_control: { type: 'ephemeral' },
    },
  ];

  const userPayload = diagnostico
    ? `Diagnóstico del aspirante:\n${JSON.stringify(diagnostico)}\n\nPregunta:\n${pregunta}`
    : pregunta;

  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: userPayload }];

  for (let turn = 0; turn < 3; turn++) {
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system,
      tools: TOOLS,
      messages,
    });

    if (resp.stop_reason !== 'tool_use') {
      const text = resp.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('\n');
      return NextResponse.json({
        respuesta: text,
        fuentes: chunks.map((c) => c.fuente),
        usage: resp.usage,
      });
    }

    messages.push({ role: 'assistant', content: resp.content });
    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of resp.content) {
      if (block.type !== 'tool_use') continue;
      if (block.name === 'search_web') {
        const input = block.input as { query: string };
        const out = await searchWeb(input.query);
        toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: out });
      }
    }
    messages.push({ role: 'user', content: toolResults });
  }

  return NextResponse.json({ error: 'max_turns' }, { status: 500 });
}
