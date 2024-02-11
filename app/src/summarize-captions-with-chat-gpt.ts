import { APIError, OpenAI } from "../deps.ts";
import { SummarizeCaptions } from "./get-captions-summary.ts";
import { FailureType, InternalFailure } from "./failure.ts";
import { createFailure, createOk, Failure, Ok } from "./result.ts";

export enum ChatGptClientCreationError {
  ModelNotSupported = "model not supported",
}

export class GptModel {
  private static readonly supportedModels: Set<string> = new Set([
    "gpt-4-1106-preview",
    "gpt-4",
    "gpt-3.5-turbo-1106",
  ]);

  private readonly _model: string;

  get model(): string {
    return this._model;
  }

  private constructor(gptModel: string) {
    this._model = gptModel;
  }

  static createGptModel(
    gptModel: string,
  ): Ok<GptModel> | Failure<ChatGptClientCreationError> {
    if (this.supportedModels.has(gptModel)) {
      return createOk(new GptModel(gptModel));
    }
    const failureMessage =
      `Model "${gptModel}" is not supported. Supported models: ${
        [...this.supportedModels].join(", ")
      }.`;
    return createFailure(
      ChatGptClientCreationError.ModelNotSupported,
      failureMessage,
    );
  }
}

export function createSummarizeCaptionsWithChatGpt(
  chatGptClient: OpenAI,
  gptModel: GptModel,
): SummarizeCaptions {
  return (systemPrompt: string, captions: string) => {
    return summarizeCaptionsWithChatGpt(
      systemPrompt,
      captions,
      chatGptClient,
      gptModel,
    );
  };
}

async function summarizeCaptionsWithChatGpt(
  systemPrompt: string,
  captions: string,
  chatGptClient: OpenAI,
  gptModel: GptModel,
): Promise<Ok<string> | InternalFailure> {
  try {
    const result = await chatGptClient.chat.completions.create({
      model: gptModel.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: captions },
      ],
      n: 1,
    });

    const content = result.choices[0].message.content;

    if (content === null) {
      return createFailure(
        FailureType.FailedToSummarizeTheVideo,
        "The summary was empty.",
      );
    }
    return createOk(content);
  } catch (error) {
    if (error instanceof APIError) {
      return createFailure(
        FailureType.FailedToSummarizeTheVideo,
        error.code || "",
      );
    }
    return createFailure(FailureType.FailedToSummarizeTheVideo);
  }
}
