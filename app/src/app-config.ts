import OpenAI from "https://deno.land/x/openai@v4.24.1/mod.ts";
import {
  fetchYoutubeCaptions,
  fetchYoutubeVideoData,
} from "./fetch-youtube-data.ts";
import {
  createGetCaptionsSummary,
  SummarizeCaptions,
} from "./get-captions-summary.ts";
import {
  createGetYoutubeCaptions,
  FetchYoutubeCaptions,
  FetchYoutubeVideoData,
} from "./get-youtube-captions.ts";
import {
  createGetYoutubeVideoSummary,
  GetCaptionsSummary,
  GetYoutubeCaptions,
  GetYoutubeVideoSummary,
} from "./get-youtube-video-summary.ts";
import {
  ChatGptClientCreationError,
  createSummarizeCaptionsWithChatGpt,
  GptModel,
} from "./summarize-captions-with-chat-gpt.ts";
import { createOk, Failure, Ok, Result } from "./result.ts";
import { createTestGetYoutubeVideoSummaryForVideoId } from "../test/get-youtube-video-summary.test.ts";

export interface AppConfig {
  getYoutubeVideoSummary: GetYoutubeVideoSummary;
}

export function bootstrapGetYoutubeVideoSummary(
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
  readonly getYoutubeVideoSummary: GetYoutubeVideoSummary;
  private chatGptClient: OpenAI;

  private constructor(gptModel: GptModel) {
    this.chatGptClient = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });

    this.getYoutubeVideoSummary = bootstrapGetYoutubeVideoSummary(
      fetchYoutubeVideoData,
      fetchYoutubeCaptions,
      createSummarizeCaptionsWithChatGpt(this.chatGptClient, gptModel),
    );
  }

  static create(
    desiredGptModel?: string,
  ): Ok<AppConfig> | Failure<ChatGptClientCreationError> {
    const gptModelResult = GptModel.createGptModel(
      desiredGptModel || "gpt-3.5-turbo-1106",
    );
    if (gptModelResult.result === Result.Ok) {
      return createOk(new ProdAppConfig(gptModelResult.data));
    } else {
      return gptModelResult;
    }
  }
}

export class TestAppConfig implements AppConfig {
  readonly getYoutubeVideoSummary: GetYoutubeVideoSummary;

  private constructor(getYoutubeVideoSummary: GetYoutubeVideoSummary) {
    this.getYoutubeVideoSummary = getYoutubeVideoSummary;
  }

  static async createForVideoId(videoId: string): Promise<AppConfig> {
    return new TestAppConfig(
      await createTestGetYoutubeVideoSummaryForVideoId(videoId),
    );
  }
}
