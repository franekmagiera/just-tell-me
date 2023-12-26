import OpenAI from "https://deno.land/x/openai@v4.24.1/mod.ts";
import {
  fetchYoutubeCaptions,
  fetchYoutubeVideoData,
} from "../src/fetch-youtube-data.ts";
import {
  createGetCaptionsSummary,
  SummarizeCaptions,
} from "../src/get-captions-summary.ts";
import {
  createGetYoutubeCaptions,
  FetchYoutubeCaptions,
  FetchYoutubeVideoData,
} from "../src/get-youtube-captions.ts";
import {
  createGetYoutubeVideoSummary,
  GetCaptionsSummary,
  GetYoutubeCaptions,
  GetYoutubeVideoSummary,
} from "../src/get-youtube-video-summary.ts";
import { createSummarizeCaptionsWithChatGpt } from "../src/summarize-captions-with-chat-gpt.ts";

export interface AppConfig {
  getYoutubeVideoSummary: GetYoutubeVideoSummary;
}

function bootstrapGetYoutubeVideoSummary(
  fetchYoutubeVideoData: FetchYoutubeVideoData,
  fetchYoutubeCaptions: FetchYoutubeCaptions,
  summarizeCaptions: SummarizeCaptions,
): GetYoutubeVideoSummary {
  const getYoutubeCaptions: GetYoutubeCaptions = createGetYoutubeCaptions(
    fetchYoutubeVideoData,
    fetchYoutubeCaptions,
  );
  const getCaptionsSummary: GetCaptionsSummary = createGetCaptionsSummary(
    summarizeCaptions,
  );
  return createGetYoutubeVideoSummary(getYoutubeCaptions, getCaptionsSummary);
}

export class ProdAppConfig implements AppConfig {
  getYoutubeVideoSummary: GetYoutubeVideoSummary;

  constructor() {
    const chatGptClient = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });

    this.getYoutubeVideoSummary = bootstrapGetYoutubeVideoSummary(
      fetchYoutubeVideoData,
      fetchYoutubeCaptions,
      createSummarizeCaptionsWithChatGpt(chatGptClient),
    );
  }
}
