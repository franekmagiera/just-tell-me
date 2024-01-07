import { ProdAppConfig } from "./app-config.ts";
import { Result } from "./result.ts";

async function main() {
  const argument = Deno.args[0];

  if (argument === undefined) {
    console.log("This script expects a YouTube video id");
    return;
  }

  const videoId: string = argument;

  const appConfig = new ProdAppConfig();
  const summary = await appConfig.getYoutubeVideoSummary(videoId);

  if (summary.result == Result.Ok) {
    console.log(summary.data);
  } else {
    console.log("Sorry, something went wrong:");
    console.log(summary.failure);
  }
}

main();
