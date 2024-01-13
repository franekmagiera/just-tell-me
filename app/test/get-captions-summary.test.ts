import { assertEquals } from "https://deno.land/std@0.211.0/assert/assert_equals.ts";
import {
  createGetCaptionsSummary,
  SummarizeCaptions,
} from "../src/get-captions-summary.ts";
import { createOk } from "../src/result.ts";
import { createPromise } from "./common.ts";

const returnPassedInCaptions: SummarizeCaptions = (
  _systemPrompt: string,
  captions: string,
) => createPromise(createOk(captions));

Deno.test("should call summarize captions function without modifying the input", async () => {
  // given
  const getCaptionsSummary = createGetCaptionsSummary(
    returnPassedInCaptions,
  );
  const captions = "Some example captions";

  // when
  const result = await getCaptionsSummary(captions);

  // then
  assertEquals(result, createOk(captions));
});

Deno.test("should strip XML tags", async () => {
  // given
  const getCaptionsSummary = createGetCaptionsSummary(
    returnPassedInCaptions,
  );
  const captions =
    `<?xml version="1.0" encoding="utf-8" ?><transcript><text start="0" dur="14.65">[Music]</text><text start="18.8" dur="7.239">we're no strangers to</text><text start="21.8" dur="7.84">love you know the rules and so do</text></transcript>`;

  // when
  const result = await getCaptionsSummary(captions);

  // then
  const expectedCaptions =
    "[Music] we're no strangers to love you know the rules and so do";
  assertEquals(result, createOk(expectedCaptions));
});
