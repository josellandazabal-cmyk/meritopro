import OpenAI from 'openai';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ChunkRAG {
  id: number;
  fuente: string;
  chunk: string;
  similarity: number;
}

export async function buscarContexto(query: string, k = 4): Promise<ChunkRAG[]> {
  const { data: emb } = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });
  const embedding = emb[0].embedding;

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.rpc('match_documentos', {
    query_embedding: embedding as unknown as string,
    match_count: k,
  });
  if (error) throw error;
  return (data ?? []) as ChunkRAG[];
}

export function formatContexto(chunks: ChunkRAG[]): string {
  return chunks
    .map((c, i) => `[${i + 1}] ${c.fuente}\n${c.chunk}`)
    .join('\n\n---\n\n');
}
