// api/analyse.js
// Vercel serverless function — proxies to Google Gemini API (FREE tier)
// Accepts Claude-style message format, translates to Gemini format
// Supports text + base64 images (for scanned PDF pages)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: { message: 'GEMINI_API_KEY not set in Vercel environment variables' } });
  }

  try {
    const { messages, system, max_tokens } = req.body;
    const parts = [];

    // Prepend system prompt
    if (system) parts.push({ text: system + '\n\n' });

    // Translate Claude message format → Gemini parts
    for (const msg of (messages || [])) {
      const content = msg.content;
      if (typeof content === 'string') {
        parts.push({ text: content });
      } else if (Array.isArray(content)) {
        for (const block of content) {
          if (block.type === 'text') {
            parts.push({ text: block.text });
          } else if (block.type === 'image' && block.source?.data) {
            // Base64 image block (scanned PDF page or photo)
            parts.push({
              inlineData: {
                mimeType: block.source.media_type || 'image/jpeg',
                data: block.source.data
              }
            });
          }
        }
      }
    }

    const payload = {
      contents: [{ parts }],
      generationConfig: {
        maxOutputTokens: max_tokens || 1500,
        temperature: 0.2
      }
    };

    // gemini-1.5-flash: free tier, vision capable, fast
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      console.error('Gemini error:', JSON.stringify(data));
      return res.status(upstream.status).json({
        error: { message: data?.error?.message || 'Gemini API error' }
      });
    }

    // Extract generated text
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Return Claude-compatible shape so frontend works unchanged
    return res.status(200).json({
      content: [{ type: 'text', text }]
    });

  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: { message: err.message } });
  }
}
