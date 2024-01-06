import { Failure } from "./result.ts";

export enum FailureType {
  CouldNotFindTheVideo,
  CouldNotFindTheCaptions,
  FailedToFetch,
  FailedToParseYoutubeData,
  FailedToSummarizeTheVideo,
}

export type InternalFailure = Failure<FailureType>;
