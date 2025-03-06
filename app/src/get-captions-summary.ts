import { InternalFailure } from "./failure.ts";
import { GetCaptionsSummary } from "./get-youtube-video-summary.ts";
import { Ok } from "./result.ts";

export type SummarizeCaptions = (
  systemPrompt: string,
  captions: string,
) => Promise<Ok<string> | InternalFailure>;

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
): Promise<Ok<string> | InternalFailure> {
  const SYSTEM_PROMPT = `You will be provided with video captions.
	Summarize the video underlining the most important themes.
	Try to keep it as short as possible without loosing context.
	Ignore sponsored segments.
	Ignore mentions of Patreon and calls to subscribe, like and comment.`;

  const sanitizedCaptions = stripXmlTags(captions);

  const summary = summarizeCaptions(SYSTEM_PROMPT, sanitizedCaptions);
  return summary;
}

function stripXmlTags(text: string): string {
  let resultingText = "";

  const chars = [...text];
  let start = 0;

  chars.forEach((char, index) => {
    if (char === "<") {
      resultingText += text.slice(start, index) + " ";
    } else if (char === ">") {
      start = index + 1;
    }
  });

  if (start === 0) {
    // Most likely it wasn't an XML, so just return the input then.
    return text;
  }

  return resultingText.trim().replace(/\s\s+/g, " ");
}
