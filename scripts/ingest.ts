import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { PDFParse } from 'pdf-parse';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const PDF_DIR = process.env.PDF_DIR ?? '../Documentacion conocimiento base';
const CHUNK_SIZE = 500;
const OVERLAP = 50;
const EMBED_MODEL = 'text-embedding-3-small';
const BATCH = 64;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

function chunkText(text: string): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += CHUNK_SIZE - OVERLAP) {
    chunks.push(words.slice(i, i + CHUNK_SIZE).join(' '));
    if (i + CHUNK_SIZE >= words.length) break;
  }
  return chunks;
}

async function embed(inputs: string[]): Promise<number[][]> {
  const res = await openai.embeddings.create({ model: EMBED_MODEL, input: inputs });
  return res.data.map((d) => d.embedding);
}

async function ingestFile(path: string, fuente: string): Promise<number> {
  const buf = readFileSync(path);
  const parser = new PDFParse({ data: new Uint8Array(buf) });
  const { text } = await parser.getText();
  const chunks = chunkText(text);
  await supabase.from('documentos_rag').delete().eq('fuente', fuente);

  let inserted = 0;
  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH);
    const embeddings = await embed(batch);
    const rows = batch.map((chunk, j) => ({
      fuente,
      chunk,
      embedding: embeddings[j] as unknown as string,
    }));
    const { error } = await supabase.from('documentos_rag').insert(rows);
    if (error) throw error;
    inserted += rows.length;
  }
  return inserted;
}

async function main() {
  const files = readdirSync(PDF_DIR).filter((f) => f.toLowerCase().endsWith('.pdf'));
  for (const file of files) {
    const n = await ingestFile(join(PDF_DIR, file), file);
    console.log(`${file}: ${n} chunks`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
