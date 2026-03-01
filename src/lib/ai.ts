import Anthropic from "@anthropic-ai/sdk";
import { HttpsProxyAgent } from "https-proxy-agent";

const proxyUrl = process.env.https_proxy || process.env.HTTPS_PROXY || process.env.http_proxy || process.env.HTTP_PROXY;

const client = new Anthropic({
  // @ts-expect-error httpAgent is supported at runtime but not in SDK types
  httpAgent: proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined,
});

export type ChallengeContent = {
  title: string;
  description: string;
  objectives: string[];
  hints: string[];
};

export type GeneratedChallenge = {
  en: ChallengeContent;
  zh: ChallengeContent;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  tags: string[];
  estimatedTime: string;
  resources: string[];
  categorySlug: string;
};

export async function generateChallenge(
  topic: string,
): Promise<GeneratedChallenge> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Generate a hands-on AI challenge project about: "${topic}"

Return a JSON object with this exact structure:
{
  "en": {
    "title": "English title (concise, 3-8 words)",
    "description": "English description (2-3 sentences explaining what to build)",
    "objectives": ["objective 1", "objective 2", "objective 3", "objective 4", "objective 5"],
    "hints": ["hint 1", "hint 2", "hint 3"]
  },
  "zh": {
    "title": "Chinese title",
    "description": "Chinese description",
    "objectives": ["目标1", "目标2", "目标3", "目标4", "目标5"],
    "hints": ["提示1", "提示2", "提示3"]
  },
  "difficulty": "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT",
  "tags": ["tag1", "tag2", "tag3"],
  "estimatedTime": "e.g. 4-6 hours",
  "resources": ["https://relevant-resource-url.com"],
  "categorySlug": "one of: web, game, mobile, ai-agents, ai-writing, ai-image, ai-video, ai-data, ai-audio, ai-coding"
}

Important:
- The challenge should be a practical, buildable project
- Objectives should be specific and measurable
- Hints should guide without giving away the solution
- Chinese translations should be natural, not literal
- Return ONLY the JSON object, no markdown fences`,
      },
    ],
  });

  const text = response.content.find((b) => b.type === "text")?.text;
  if (!text) throw new Error("No text response from AI");

  return JSON.parse(text) as GeneratedChallenge;
}

export async function translateChallenge(
  content: ChallengeContent,
  sourceLocale: string,
  targetLocale: string,
): Promise<ChallengeContent> {
  const localeNames: Record<string, string> = {
    en: "English",
    zh: "Chinese",
  };

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `Translate this challenge content from ${localeNames[sourceLocale] || sourceLocale} to ${localeNames[targetLocale] || targetLocale}.

Source content:
${JSON.stringify(content, null, 2)}

Return a JSON object with the same structure:
{
  "title": "translated title",
  "description": "translated description",
  "objectives": ["translated objective 1", ...],
  "hints": ["translated hint 1", ...]
}

Important:
- Translate naturally, not literally
- Keep technical terms in their commonly used form for the target language
- Maintain the same level of detail and specificity
- Return ONLY the JSON object, no markdown fences`,
      },
    ],
  });

  const text = response.content.find((b) => b.type === "text")?.text;
  if (!text) throw new Error("No text response from AI");

  return JSON.parse(text) as ChallengeContent;
}
