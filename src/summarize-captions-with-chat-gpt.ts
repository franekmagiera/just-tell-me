import OpenAI from "https://deno.land/x/openai@v4.24.1/mod.ts";
import { SummarizeCaptions } from "./get-captions-summary.ts";

export function createSummarizeCaptionsWithChatGpt(
  chatGptClient: OpenAI,
): SummarizeCaptions {
  return (systemPrompt: string, captions: string) => {
    return summarizeCaptionsWithChatGpt(
      systemPrompt,
      captions,
      chatGptClient,
    );
  };
}

async function summarizeCaptionsWithChatGpt(
  systemPrompt: string,
  captions: string,
  chatGptClient: OpenAI,
): Promise<string> {
  const result = await chatGptClient.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: captions },
    ],
    n: 1,
  });

  // TODO: add a metric for null responses.
  return result.choices[0].message.content || "";
}
