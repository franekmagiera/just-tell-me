import { FailureType, InternalFailure } from "./failure.ts";
import { GetYoutubeCaptions } from "./get-youtube-video-summary.ts";
import { createFailure, createOk, Ok, Result } from "./result.ts";

// Just specifying whatever I'm going to use.
interface CaptionsMetadata {
  captionTracks: CaptionTrack[];
  defaultAuidoTrackIndex: number;
}

interface CaptionTrack {
  baseUrl: string;
  languageCode: string;
}

export type FetchYoutubeVideoData = (
  videoId: string,
) => Promise<Ok<string> | InternalFailure>;
export type FetchYoutubeCaptions = (
  captionsUrl: string,
) => Promise<Ok<string> | InternalFailure>;

export function createGetYoutubeCaptions(
  fetchYoutubeVideoData: FetchYoutubeVideoData,
  fetchYoutubeCaptions: FetchYoutubeCaptions,
): GetYoutubeCaptions {
  return (videoId: string) => {
    return getYoutubeCaptions(
      videoId,
      fetchYoutubeVideoData,
      fetchYoutubeCaptions,
    );
  };
}

async function getYoutubeCaptions(
  videoId: string,
  fetchYoutubeVideoData: FetchYoutubeVideoData,
  fetchYoutubeCaptions: FetchYoutubeCaptions,
): Promise<Ok<string> | InternalFailure> {
  const fetchYoutubeVideoDataResult = await fetchYoutubeVideoData(videoId);
  if (fetchYoutubeVideoDataResult.result === Result.Ok) {
    const youtubeVideoData = fetchYoutubeVideoDataResult.data;
    const dereferencingResult = dereferenceCaptionsMetadata(
      youtubeVideoData,
    );
    if (dereferencingResult.result === Result.Ok) {
      const captionsMetadata = dereferencingResult.data;
      const captionsUrl = captionsMetadata.captionTracks[0].baseUrl;
      const captions = fetchYoutubeCaptions(captionsUrl);
      return captions;
    } else {
      // Couldn't dereference the captions, propagate the failure.
      return dereferencingResult;
    }
  } else {
    // Couldn't fetch youtube video data, propagate the failure.
    return fetchYoutubeVideoDataResult;
  }
}

function dereferenceCaptionsMetadata(
  youtubeVideoData: string,
): Ok<CaptionsMetadata> | InternalFailure {
  // The response is a huge HTML that somewhere contains a JSON object that
  // is stored under the `playerCaptionsTracklistRenderer` key.
  // This function just searches for that key and tries to scan the JSON.
  const CAPTIONS_KEY = '"playerCaptionsTracklistRenderer":';

  const captionsIndex = youtubeVideoData.indexOf(CAPTIONS_KEY);
  if (captionsIndex == -1) {
    return createFailure(FailureType.FailedToParseYoutubeData);
  }

  const start = captionsIndex + CAPTIONS_KEY.length;
  const closingBracketResult = findClosingBracket(youtubeVideoData, start);
  if (closingBracketResult.result === Result.Ok) {
    const end = closingBracketResult.data;
    const json = JSON.parse(youtubeVideoData.slice(start, end));
    return createOk(json);
  }
  return closingBracketResult;
}

function findClosingBracket(
  text: string,
  start: number,
): Ok<number> | InternalFailure {
  if (text[start] != "{") {
    return createFailure(FailureType.FailedToParseYoutubeData);
  }

  let index = start + 1;
  let depth = 1;

  while (depth != 0 && index < text.length) {
    if (text[index] == "{") {
      depth += 1;
    }
    if (text[index] == "}") {
      depth -= 1;
    }
    index += 1;
  }

  if (depth != 0) {
    return createFailure(FailureType.FailedToParseYoutubeData);
  }

  return createOk(index);
}
