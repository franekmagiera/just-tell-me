import { InternalFailure } from "./failure.ts";
import { Ok, Result } from "./result.ts";

export type GetYoutubeVideoSummary = (
  videoId: string,
) => Promise<Ok<string> | InternalFailure>;
export type GetYoutubeCaptions = (
  videoId: string,
) => Promise<Ok<string> | InternalFailure>;
export type GetCaptionsSummary = (
  videoId: string,
) => Promise<Ok<string> | InternalFailure>;

export function createGetYoutubeVideoSummary(
  getYoutubeCaptions: GetYoutubeCaptions,
  getCaptionsSummary: GetCaptionsSummary,
): GetYoutubeVideoSummary {
  return (videoId: string) => {
    return getYoutubeVideoSummary(
      videoId,
      getYoutubeCaptions,
      getCaptionsSummary,
    );
  };
}

async function getYoutubeVideoSummary(
  videoId: string,
  getYoutubeCaptions: GetYoutubeCaptions,
  getCaptionsSummary: GetCaptionsSummary,
): Promise<Ok<string> | InternalFailure> {
  const getYoutubeCaptionsResult = await getYoutubeCaptions(videoId);
  if (getYoutubeCaptionsResult.result === Result.Ok) {
    const captions = getYoutubeCaptionsResult.data;
    const summary = getCaptionsSummary(captions);
    return summary;
  } else {
    // Couldn't get youtube captions, propagate the failure.
    return getYoutubeCaptionsResult;
  }
}
