import { GetYoutubeCaptions } from "./get-youtube-video-summary.ts";

// Just specifying whatever I'm going to use.
interface CaptionsMetadata {
  captionTracks: CaptionTrack[];
  defaultAuidoTrackIndex: number;
}

interface CaptionTrack {
  baseUrl: string;
  languageCode: string;
}

export type FetchYoutubeVideoData = (videoId: string) => Promise<string>;
export type FetchYoutubeCaptions = (captionsUrl: string) => Promise<string>;

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
): Promise<string> {
  const youtubeVideoData = await fetchYoutubeVideoData(videoId);
  const captionsMetadata = dereferenceCaptionsMetadata(youtubeVideoData);
  const captionsUrl = captionsMetadata.captionTracks[0].baseUrl;
  const captions = fetchYoutubeCaptions(captionsUrl);
  return captions;
}

// TODO: Create a base domain error?
class CouldNotParseYoutubeDataError extends Error {}

function dereferenceCaptionsMetadata(
  youtubeVideoData: string,
): CaptionsMetadata {
  // The response is a huge HTML that somewhere contains a JSON object that
  // is stored under the `playerCaptionsTracklistRenderer` key.
  // This function just searches for that key and tries to scan the JSON.
  const CAPTIONS_KEY = '"playerCaptionsTracklistRenderer":';

  const captionsIndex = youtubeVideoData.indexOf(CAPTIONS_KEY);
  if (captionsIndex == -1) {
    throw new CouldNotParseYoutubeDataError();
  }

  const start = captionsIndex + CAPTIONS_KEY.length;
  const end = findClosingBracket(youtubeVideoData, start);
  const json = JSON.parse(youtubeVideoData.slice(start, end));
  return json;
}

function findClosingBracket(text: string, start: number): number {
  // TODO: Think about using Options and Results instead of throwing.
  if (text[start] != "{") {
    throw new CouldNotParseYoutubeDataError();
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
    throw new CouldNotParseYoutubeDataError();
  }

  return index;
}
