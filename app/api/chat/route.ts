import postsData from "@/lib/posts-bundle.json";

export const runtime = "edge";
export const maxDuration = 30;

// Simple relevance search: score posts by keyword matches
function findRelevantPosts(query: string, topK = 8) {
  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const scored = postsData.map((post) => {
    const text =
      `${post.title} ${post.subtitle || ""} ${post.content}`.toLowerCase();
    let score = 0;
    for (const kw of keywords) {
      // Title matches worth more
      if (post.title.toLowerCase().includes(kw)) score += 3;
      if ((post.subtitle || "").toLowerCase().includes(kw)) score += 2;
      // Count content matches
      const matches = text.split(kw).length - 1;
      score += Math.min(matches, 5); // cap per keyword
    }
    return { ...post, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((p) => p.score > 0);
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Chat is not configured yet." },
      { status: 503 }
    );
  }

  const { message, history } = (await request.json()) as {
    message: string;
    history?: Array<{ role: string; content: string }>;
  };

  if (!message || typeof message !== "string") {
    return Response.json({ error: "Message is required." }, { status: 400 });
  }

  // Find relevant posts
  const relevant = findRelevantPosts(message);

  // Build context from relevant posts
  let context = "";
  if (relevant.length > 0) {
    context = relevant
      .map(
        (p) =>
          `---\nTitle: ${p.title}\nDate: ${p.date}\nSubtitle: ${p.subtitle || "N/A"}\n---\n${p.content}`
      )
      .join("\n\n");
  } else {
    // If no keyword matches, include the 8 most recent posts
    context = postsData
      .slice(0, 8)
      .map(
        (p) =>
          `---\nTitle: ${p.title}\nDate: ${p.date}\nSubtitle: ${p.subtitle || "N/A"}\n---\n${p.content}`
      )
      .join("\n\n");
  }

  // Build messages array
  const messages = [];

  // Include last 6 messages of history for context
  if (history && Array.isArray(history)) {
    const recent = history.slice(-6);
    for (const msg of recent) {
      messages.push({ role: msg.role, content: msg.content });
    }
  }

  messages.push({ role: "user", content: message });

  // Call Anthropic API with streaming
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6-20250514",
      max_tokens: 1024,
      stream: true,
      system: `You are the "How to AI" assistant, powered by Ruben Hassid's newsletter archive. Answer questions based on the newsletter content provided below. Be concise, practical, and helpful — match Ruben's style: direct, no fluff, step-by-step when needed.

If the answer is clearly in the newsletters, cite which post it came from (title and date). If the user asks something not covered in the newsletters, say so honestly and give your best answer anyway.

Keep responses short and scannable. Use bullet points or numbered steps when listing things.

NEWSLETTER CONTENT:
${context}`,
      messages,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Anthropic API error:", err);
    return Response.json(
      { error: "Failed to get response." },
      { status: 500 }
    );
  }

  // Stream the response back using SSE
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                if (
                  parsed.type === "content_block_delta" &&
                  parsed.delta?.text
                ) {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ text: parsed.delta.text })}\n\n`
                    )
                  );
                }
              } catch {
                // skip unparseable chunks
              }
            }
          }
        }
      } finally {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
