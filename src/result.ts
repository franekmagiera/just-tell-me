// My own implementation of the Result type.
export enum Result {
  Ok = "Ok",
  Failure = "Failure",
}

export type Ok<T> = {
  result: Result.Ok;
  data: T;
};

export const createOk = <T>(data: T): Ok<T> => ({
  result: Result.Ok,
  data,
});

export type Failure<T> = {
  result: Result.Failure;
  failure: T;
};

export const createFailure = <T>(failure: T): Failure<T> => ({
  result: Result.Failure,
  failure,
});
