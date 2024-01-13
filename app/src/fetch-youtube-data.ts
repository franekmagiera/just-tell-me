import { FailureType, InternalFailure } from "./failure.ts";
import {
  FetchYoutubeCaptions,
  FetchYoutubeVideoData,
} from "./get-youtube-captions.ts";
import { createFailure, createOk, Ok } from "./result.ts";

export const fetchYoutubeVideoData: FetchYoutubeVideoData = async (
  videoId: string,
): Promise<Ok<string> | InternalFailure> => {
  const response = await fetch(`https://youtube.com/watch?v=${videoId}`);
  if (response.ok) {
    const text = await response.text();
    return createOk(text);
  }
  if (response.status === 404) {
    return createFailure(FailureType.CouldNotFindTheVideo);
  }
  return createFailure(FailureType.FailedToFetch, response.statusText);
};

export const fetchYoutubeCaptions: FetchYoutubeCaptions = async (
  captionsUrl: string,
): Promise<Ok<string> | InternalFailure> => {
  const response = await fetch(captionsUrl);
  if (response.ok) {
    const text = await response.text();
    return createOk(text);
  }
  if (response.status === 404) {
    return createFailure(FailureType.CouldNotFindTheCaptions);
  }
  return createFailure(FailureType.FailedToFetch, response.statusText);
};
