import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { getAppConfig } from "../../app/src/app-config.ts";
import { InternalFailure } from "../../app/src/failure.ts";
import { Result } from "../../app/src/result.ts";
import { Ok } from "../../app/src/result.ts";
import { ErrorPage } from "../../components/ErrorPage.tsx";
import { Summary } from "../../components/Summary.tsx";

export const handler: Handlers = {
  async GET(
    req: Request,
    ctx: FreshContext,
  ) {
    const videoId = new URL(req.url).searchParams.get("id") || "";
    const appResult = await getAppConfig();
    if (appResult.result === Result.Failure) {
      return ctx.render(appResult);
    }
    const app = appResult.data;
    const summaryResult = await app.getYoutubeVideoSummary(videoId);
    return ctx.render(summaryResult);
  },
};

export default function YoutubeVideoSummary(
  props: PageProps<Ok<string> | InternalFailure>,
) {
  if (props.data.result === Result.Failure) {
    return ErrorPage(
      "Something went wrong",
      props.data.message || "",
      props.data.failure,
    );
  }
  return Summary(props.data.data);
}
