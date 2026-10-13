const corsHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}

export async function onRequestPost({ request, env }) {
  if (!env.GEMINI_API_KEY) {
    return json({ error: "Server setup is incomplete: GEMINI_API_KEY is not configured." }, 500);
  }

  let body;
  try { body = await request.json(); }
  catch { return json({ error: "Please send a valid JSON request." }, 400); }

  const allowed = {
    business: String(body.business || "").trim().slice(0, 120),
    offer: String(body.offer || "").trim().slice(0, 1200),
    platform: String(body.platform || "TikTok").slice(0, 60),
    goal: String(body.goal || "Get customers").slice(0, 80),
    tone: String(body.tone || "Professional").slice(0, 80),
    language: String(body.language || "English").slice(0, 60),
    extra: String(body.extra || "").trim().slice(0, 500)
  };

  if (!allowed.business || !allowed.offer) {
    return json({ error: "Add your business and describe what you are promoting." }, 400);
  }

  const prompt = `You are Suprema AI Studio, a practical marketing copy assistant for creators and small businesses, including businesses in Uganda.
Create an actionable content pack using the brief below.
Business: ${allowed.business}
Offer: ${allowed.offer}
Platform: ${allowed.platform}
Goal: ${allowed.goal}
Tone: ${allowed.tone}
Language: ${allowed.language}
Extra instructions: ${allowed.extra || "None"}
Requirements:
- Give 3 distinct short hooks.
- Give 2 polished captions suited to the selected platform.
- Give 5-10 relevant hashtags; do not claim a hashtag is trending unless verified.
- Include one clear call to action.
- Suggest one simple photo or short-video idea.
- If the goal is finding potential clients, include a concise, respectful outreach message.
- Do not invent prices, testimonials, results, business facts, addresses or contact details.
- Make it easy to copy and use. Use headings and plain text.`;

  try {
    const apiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 1200 }
        })
      }
    );

    const result = await apiResponse.json().catch(() => ({}));
    if (!apiResponse.ok) {
      // Avoid exposing raw upstream details or any secret values to the browser.
      const message = apiResponse.status === 429
        ? "The AI service rate limit was reached. Wait a little and try again."
        : "The AI service request failed. Check your API key, model access and quota.";
      return json({ error: message }, apiResponse.status === 429 ? 429 : 502);
    }

    const text = (result.candidates || [])
      .flatMap(candidate => candidate.content?.parts || [])
      .map(part => part.text || "")
      .join("\n")
      .trim();

    if (!text) return json({ error: "The AI returned an empty response. Please try again." }, 502);
    return json({ text });
  } catch {
    return json({ error: "Could not reach the AI service. Check the connection and try again." }, 502);
  }
}