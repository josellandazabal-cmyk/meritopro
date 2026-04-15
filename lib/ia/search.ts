interface TavilyResult {
  title: string;
  url: string;
  content: string;
}

interface TavilyResponse {
  results?: TavilyResult[];
  answer?: string;
}

export async function searchWeb(query: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return 'search_web no configurado (falta TAVILY_API_KEY).';

  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: 'basic',
      max_results: 3,
      include_answer: true,
    }),
  });
  if (!res.ok) return `Error búsqueda web: ${res.status}`;
  const data = (await res.json()) as TavilyResponse;
  const parts: string[] = [];
  if (data.answer) parts.push(`Resumen: ${data.answer}`);
  (data.results ?? []).forEach((r, i) => {
    parts.push(`[${i + 1}] ${r.title} — ${r.url}\n${r.content}`);
  });
  return parts.join('\n\n');
}
