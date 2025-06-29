**WARNING:** This project is no longer maintained. I took down the deployment
as well. Keeping up with the quirks of getting the video captions has become
too much effort for me (especially that the main goal of this project was to
play around with Deno and Fresh).

# Just Tell Me!

<a href="https://fresh.deno.dev">
  <img
    width="197"
    height="37"
    src="https://fresh.deno.dev/fresh-badge-dark.svg"
    alt="Made with Fresh"
  />
</a>

Have you ever wasted some time watching a youtube video, that got you kind of
interested because of the click-baity topic, but in the end turned out to be
nothing more BUT click-bait? Or have you ever wanted to just quickly recall what
a video that you've watched some time ago was about? Just Tell Me has you
covered!

Just Tell Me is an app that summarizes youtube videos using ChatGPT. It uses the
captions provided by youtube to ask ChatGPT to summarize the content.

Check it out at https://just-tell-me.deno.dev/.

The core of the app is written in Typescript and relies on
[Deno](https://docs.deno.com/runtime/manual). The web app is built with
[Fresh](https://fresh.deno.dev/) and deployed with
[Deno Deploy](https://deno.com/deploy).

## How to run

You can run the app from the CLI if you have `deno` installed:

```
deno run -A run.ts youtubeVideoId
```

The program relies on OpenAI API for ChatGPT and requires a `OPENAI_API_KEY`
environment variable that contains a valid OpenAI API key.

By default, the app uses the `gpt-4o-mini-2024-07-18` model, but you can also
use other models, like `gpt-4` and `gpt-4-1106-preview`, by including a
`--model=gpt-4` flag. All available models are listed in
`app/src/summarize-captions-with-chat-gpt.ts`.

Optionally, you can run the app in test mode (only `test` is considered a valid
video id then) with:

```
TEST=true deno run -A run.ts test
```

To launch the web app locally, run:

```
deno task start
```

(You can also include `TEST=true` environment variable, to run the web app in
test mode)
