import { createHandler, ServeHandlerInfo } from "$fresh/server.ts";
import manifest from "../fresh.gen.ts";
import config from "../fresh.config.ts";
import { assert } from "$std/assert/assert.ts";

const CONN_INFO: ServeHandlerInfo = {
  remoteAddr: { hostname: "127.0.0.1", port: 53496, transport: "tcp" },
};

Deno.test("HTTP tests", async (t) => {
  Deno.env.set("TEST", "true");

  const handler = await createHandler(manifest, config);

  await t.step("GET /summary/youtube", async () => {
    for (
      const id of [
        "test",
        "www.youtube.com/watch?v=test",
        "youtu.be/test",
        "youtube.com/watch?v=test&trackingId=123",
        "youtube.com/watch?v=test I don't know why this was in my clipboard",
        "youtu.be/test?trackingId=123",
      ]
    ) {
      const response = await handler(
        new Request(`http://127.0.0.1/summary/youtube?id=${id}`),
        CONN_INFO,
      );
      const text = await response.text();
      assert(
        text.includes(
          "The video is a music video for the song &quot;Never Gonna Give You Up&quot;",
        ),
        `Text does not include the expected output for id ${id}. Did get: ${text}`,
      );
    }
  });

  Deno.env.delete("TEST");
});
