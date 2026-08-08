/**
 * Low-level LLM caller. Returns null on any failure (triggers fallback mode).
 */
export async function callLLM(
  systemPrompt: string,
  userPrompt: string,
  format: 'text' | 'json_object' = 'text'
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null; // Demo / fallback mode

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: format },
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) {
      console.error('LLM error', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return (data.choices?.[0]?.message?.content as string) ?? null;
  } catch (err) {
    console.error('LLM call failed:', err);
    return null;
  }
}
