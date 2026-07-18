// Vercel serverless function: POST /api/ai
// Keeps the Groq API key on the server. The browser never sees it.
//
// Body: { system: string, userPrompt: string }
// Response: { text: string }

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { system, userPrompt } = req.body || {};
  if (!userPrompt || typeof userPrompt !== "string") {
    return res.status(400).json({ error: "Missing userPrompt" });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing GROQ_API_KEY" });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1000,
        messages: [
          { role: "system", content: system || "" },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Groq API error:", response.status, errBody);
      return res.status(502).json({ error: "Upstream AI request failed" });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    return res.status(200).json({ text });
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Unexpected server error" });
  }
}
