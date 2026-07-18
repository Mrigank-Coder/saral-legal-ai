// Vercel serverless function: POST /api/ai
// Keeps the Groq API key on the server. The browser never sees it.
//
// Body: { system: string, userPrompt: string, images?: string[], maxTokens?: number }
//   images, if present, are base64 data URLs (e.g. "data:image/jpeg;base64,...").
//   When images are present we route to a vision-capable model instead of the
//   text-only one, since Groq's text models can't see images.
// Response: { text: string }

// Text-only calls (explain / translate / extract). llama-3.3-70b-versatile is
// on Groq's deprecation path (shutdown 2026-08-16), so this already points at
// its recommended production replacement.
const TEXT_MODEL = "openai/gpt-oss-120b";

// Vision calls (scanned-document OCR). Groq's only current multimodal model;
// it's a preview model, so keep an eye on console.groq.com/docs/deprecations
// in case Groq graduates or replaces it.
const VISION_MODEL = "qwen/qwen3.6-27b";

const MAX_IMAGES = 5; // matches Groq's per-request image cap

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { system, userPrompt, maxTokens, images } = req.body || {};
  if (!userPrompt || typeof userPrompt !== "string") {
    return res.status(400).json({ error: "Missing userPrompt" });
  }
  const safeMaxTokens = Number.isFinite(maxTokens)
    ? Math.min(Math.max(maxTokens, 256), 4000)
    : 1000;
  if (userPrompt.length > 60000) {
    return res.status(400).json({ error: "Document is too long. Please paste a shorter excerpt (under ~60,000 characters)." });
  }

  const hasImages = Array.isArray(images) && images.length > 0;
  if (hasImages) {
    if (images.length > MAX_IMAGES) {
      return res.status(400).json({ error: `Please send at most ${MAX_IMAGES} pages/images at a time.` });
    }
    for (const img of images) {
      if (typeof img !== "string" || !img.startsWith("data:image/")) {
        return res.status(400).json({ error: "Images must be base64 data URLs." });
      }
      // Groq's base64-encoded-image request limit is 4MB per image.
      if (img.length > 5.4 * 1024 * 1024) {
        return res.status(400).json({ error: "One of the images is too large. Try a lower-resolution photo or scan." });
      }
    }
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing GROQ_API_KEY" });
  }

  const userContent = hasImages
    ? [
        { type: "text", text: userPrompt },
        ...images.map((url) => ({ type: "image_url", image_url: { url } })),
      ]
    : userPrompt;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: hasImages ? VISION_MODEL : TEXT_MODEL,
        max_tokens: safeMaxTokens,
        messages: [
          { role: "system", content: system || "" },
          { role: "user", content: userContent },
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
