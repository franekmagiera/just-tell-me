import {
  FetchYoutubeCaptions,
  FetchYoutubeVideoData,
} from "./get-youtube-captions.ts";

export const fetchYoutubeVideoData: FetchYoutubeVideoData = async (
  videoId: string,
): Promise<string> => {
  const response = await fetch(`https://youtube.com/watch?v=${videoId}`);
  return response.text();
};

export const fetchYoutubeCaptions: FetchYoutubeCaptions = async (
  captionsUrl: string,
): Promise<string> => {
  const response = await fetch(captionsUrl);
  return response.text();
};
