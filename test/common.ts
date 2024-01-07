export const createPromise = <T>(data: T): Promise<T> => (
  new Promise((resolve) => resolve(data))
);
