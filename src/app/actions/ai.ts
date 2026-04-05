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