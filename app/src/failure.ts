import { Failure } from "./result.ts";

export enum FailureType {
  CouldNotFindTheVideo = "could not find the video",
  CouldNotFindTheCaptions = "could not find the captions",
  EmptyCaptions = "captions are empty",
  FailedToFetch = "failed to fetch",
  FailedToParseYoutubeData = "failed to parse youtube data",
  FailedToSummarizeTheVideo = "failed to summarize the video",
}

export type InternalFailure = Failure<FailureType>;
