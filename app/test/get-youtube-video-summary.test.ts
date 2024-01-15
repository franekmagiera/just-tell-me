import { bootstrapGetYoutubeVideoSummary } from "../src/app-config.ts";
import { FailureType } from "../src/failure.ts";
import { SummarizeCaptions } from "../src/get-captions-summary.ts";
import {
  FetchYoutubeCaptions,
  FetchYoutubeVideoData,
} from "../src/get-youtube-captions.ts";
import { createFailure, createOk } from "../src/result.ts";
import { assertEquals } from "https://deno.land/std@0.211.0/assert/mod.ts";
import { createPromise } from "./common.ts";

export const SUCCESSFUL_CHAT_GPT_CAPTIONS_SUMMARY =
  `The video is a music video for the song "Never Gonna Give You Up" by Rick
  Astley. The captions display the lyrics of the song, which talk about love
  and commitment, assuring that the singer will never give up on the person
  they love. The video mainly consists of the lyrics being displayed on the
  screen, with the song playing in the background.`;

// End-to-end test with real data from YouTube.
Deno.test("should get youtube video summary", async () => {
  // given
  const videoId = "videoId";
  const getYoutubeVideoSummary =
    await createTestGetYoutubeVideoSummaryForVideoId(videoId);

  // when
  const result = await getYoutubeVideoSummary(videoId);

  // then
  assertEquals(result, createOk(SUCCESSFUL_CHAT_GPT_CAPTIONS_SUMMARY));
});

export const createTestGetYoutubeVideoSummaryForVideoId = async (
  videoId: string,
) => {
  const textDecoder = new TextDecoder("utf-8");

  const SUCCESSFUL_YOUTUBE_DATA_RESPONSE_PATH =
    "./app/test/data/successfulYoutubeDataResponse.html";
  const successfulYoutubeDataResponse = textDecoder.decode(
    await Deno.readFile(SUCCESSFUL_YOUTUBE_DATA_RESPONSE_PATH),
  );
  const fetchYoutubeVideoData = createFetchYoutubeVideoDataForVideoId(
    videoId,
    successfulYoutubeDataResponse,
  );

  const EXPECTED_CAPTIONS_URL_PATH = "./app/test/data/expectedCaptionsUrl.txt";
  const expectedCaptionsUrl = textDecoder.decode(
    await Deno.readFile(EXPECTED_CAPTIONS_URL_PATH),
  );
  const SUCCESSFUL_YOUTUBE_CAPTIONS_RESPONSE_PATH =
    "./app/test/data/successfulYoutubeCaptionsResponse.xml";
  const successfulYoutubeCaptionsResponse = textDecoder.decode(
    await Deno.readFile(SUCCESSFUL_YOUTUBE_CAPTIONS_RESPONSE_PATH),
  );
  const getYoutubeCaptions = createGetYoutubeCaptionsForCaptionsUrl(
    expectedCaptionsUrl,
    successfulYoutubeCaptionsResponse,
  );

  const alwaysSuccessfulSummarizeCaptions =
    createAlwaysSuccessfulSummarizeCaptions(
      SUCCESSFUL_CHAT_GPT_CAPTIONS_SUMMARY,
    );

  return bootstrapGetYoutubeVideoSummary(
    fetchYoutubeVideoData,
    getYoutubeCaptions,
    alwaysSuccessfulSummarizeCaptions,
  );
};

const createFetchYoutubeVideoDataForVideoId = (
  expectedVideoId: string,
  dataToReturn: string,
): FetchYoutubeVideoData => {
  return (videoId: string) => {
    if (expectedVideoId === videoId) {
      return createPromise(createOk(dataToReturn));
    } else {
      return createPromise(createFailure(FailureType.CouldNotFindTheVideo));
    }
  };
};

const createAlwaysSuccessfulSummarizeCaptions = (
  dataToReturn: string,
): SummarizeCaptions => {
  return (_systemPrompt: string, _captions: string) =>
    createPromise(createOk(dataToReturn));
};

const createGetYoutubeCaptionsForCaptionsUrl = (
  expectedCaptionsUrl: string,
  dataToReturn: string,
): FetchYoutubeCaptions => {
  return (videoId: string) => {
    if (videoId === expectedCaptionsUrl) {
      return createPromise(createOk(dataToReturn));
    } else {
      return createPromise(createFailure(FailureType.CouldNotFindTheCaptions));
    }
  };
};
