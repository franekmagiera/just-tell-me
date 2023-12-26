import { GetCaptionsSummary } from "./get-youtube-video-summary.ts";

export type SummarizeCaptions = (
  systemPrompt: string,
  captions: string,
) => Promise<string>;

export function createGetCaptionsSummary(
  summarizeCaptions: SummarizeCaptions,
): GetCaptionsSummary {
  return (captions: string) => {
    return getCaptionsSummary(captions, summarizeCaptions);
  };
}

function getCaptionsSummary(
  captions: string,
  summarizeCaptions: SummarizeCaptions,
): Promise<string> {
  const sanitizedCaptions = stripXmlTags(captions);
  const systemPrompt =
    "You will be provided with video captions. Summarize the video in one paragraph.";

  const summary = summarizeCaptions(systemPrompt, sanitizedCaptions);
  return summary;
}

function stripXmlTags(text: string): string {
  let resultingText = "";

  const chars = [...text];
  let start = 0;

  chars.forEach((char, index) => {
    if (char === "<") {
      resultingText += text.slice(start, index);
    } else if (char === ">") {
      start = index + 1;
    }
  });

  return resultingText;
}
