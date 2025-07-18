// Entrypoint to run "just tell me" from the command line interface.
import { getAppConfig } from "./app/src/app-config.ts";
import { Result } from "./app/src/result.ts";
import { parseArgs } from "https://deno.land/std@0.207.0/cli/parse_args.ts";

async function run() {
  const argument = Deno.args[0];

  if (argument === undefined) {
    console.log("This script expects a YouTube video id");
    return;
  }
  const videoId: string = argument;

  const flags = parseArgs(Deno.args, {
    string: ["model"],
  });

  const appConfigResult = await getAppConfig(flags.model);
  if (appConfigResult.result === Result.Failure) {
    console.log(appConfigResult.failure, "\n", appConfigResult.message);
  } else {
    const appConfig = appConfigResult.data;
    const summaryResult = await appConfig.getYoutubeVideoSummary(videoId);
    if (summaryResult.result === Result.Ok) {
      console.log(summaryResult.data);
    } else {
      console.error(summaryResult);
    }
  }
}

run();
