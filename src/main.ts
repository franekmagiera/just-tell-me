import { ProdAppConfig } from "./app-config.ts";

async function main() {
  const argument = Deno.args[0];

  if (argument === undefined) {
    console.log("This script expects a YouTube video id");
    return;
  }

  const videoId: string = argument;

  const appConfig = new ProdAppConfig();
  const summary = await appConfig.getYoutubeVideoSummary(videoId);

  console.log(summary);
}

main();
