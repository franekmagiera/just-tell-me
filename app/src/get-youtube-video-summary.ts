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
  if (getYoutubeCaptionsResult.result === Result.Failure) {
    console.error({
      errorType: getYoutubeCaptionsResult.failure,
      errorMessage: getYoutubeCaptionsResult.message || "",
    });
    // Couldn't get youtube captions, propagate the failure.
    return getYoutubeCaptionsResult;
  }
  const captions = getYoutubeCaptionsResult.data;
  const summary = await getCaptionsSummary(captions);
  if (summary.result === Result.Failure) {
    console.error({
      errorType: summary.failure,
      errorMessage: summary.message || "",
    });
  }
  return summary;
}
