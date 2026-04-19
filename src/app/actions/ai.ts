"use server";

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function generateSummary(content: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. Summarize blog posts in 3-4 clear, concise sentences. Focus on key points, easy to understand for students.",
      },
      {
        role: "user",
        content: `Summarize this blog post:\n\n${content}`,
      },
    ],
    max_tokens: 200,
  });

  return completion.choices[0]?.message?.content ?? "Could not generate summary.";
}

export async function translatePostToBangla(content: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are a professional translator. Translate English blog HTML into natural Bangla. Preserve all HTML tags, structure, and links exactly. Translate only human-readable text. Return HTML only, with no markdown fences and no extra commentary.",
      },
      {
        role: "user",
        content: `Translate this blog HTML to Bangla:\n\n${content}`,
      },
    ],
    max_tokens: 4000,
  });

  return completion.choices[0]?.message?.content ?? content;
}