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
    const idParamValue = new URL(req.url).searchParams.get("id") || "";
    const videoId = dereferenceVideoIdFromUrlPath(idParamValue);
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

function dereferenceVideoIdFromUrlPath(idParamValue: string) {
  // I want this to work even if someone pastes an incorrect URL, so I'm not
  // using the URL classes and I'm trying to parse the youtube video id by
  // hand.
  let idStartIndex = -1;

  if (idParamValue.includes("youtube.com")) {
    const vKeyId = idParamValue.indexOf("v=");
    if (vKeyId != -1) {
      idStartIndex = vKeyId + "v=".length;
    } else {
      // Just give up, I can't dereference this, so let's try with user's
      // input.
      return idParamValue;
    }
  } else if (idParamValue.includes("youtu.be/")) {
    idStartIndex = idParamValue.indexOf("youtu.be/") + "youtu.be/".length;
  }

  if (idStartIndex != -1) {
    let idEndIndex = idStartIndex + 1;
    while (
      idEndIndex < idParamValue.length &&
      !isWhitespace(idParamValue[idEndIndex]) &&
      idParamValue[idEndIndex] != "&" &&
      idParamValue[idEndIndex] != "?"
    ) {
      idEndIndex++;
    }
    return idParamValue.slice(idStartIndex, idEndIndex);
  }

  return idParamValue;
}

function isWhitespace(char: string) {
  return /\s/.test(char);
}
