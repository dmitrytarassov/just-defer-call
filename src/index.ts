const deferCall =
  <T, Args extends unknown[]>(
    fn: (...args: Args) => T | Promise<T>,
    ...args: Args
  ): (() => T | Promise<T>) =>
  (): T | Promise<T> => {
    return fn(...args);
  };

export default deferCall;
