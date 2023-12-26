export type GetYoutubeVideoSummary = (videoId: string) => Promise<string>;
export type GetYoutubeCaptions = (videoId: string) => Promise<string>;
export type GetCaptionsSummary = (videoId: string) => Promise<string>;

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
): Promise<string> {
  const captions = await getYoutubeCaptions(videoId);
  const summary = getCaptionsSummary(captions);
  return summary;
}
