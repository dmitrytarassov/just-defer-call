import { describe, expect, jest, test } from "@jest/globals";

import { deferCall } from "../src";

function sum(a: number, b: number): number {
  return a + b;
}

async function stupidFunction(value: number): Promise<number> {
  void 1;
  return value;
}

describe("deferCall", () => {
  test("deferCall should defer a synchronous function", () => {
    const mockFn = jest.fn(sum);
    const deferred = deferCall(mockFn, 2, 3);

    expect(mockFn).not.toHaveBeenCalled();
    deferred();
    expect(mockFn).toHaveBeenCalledWith(2, 3);
  });

  test("deferCall should defer an asynchronous function", async () => {
    const mockFn = jest.fn(stupidFunction);
    const deferred = deferCall(mockFn, 42);

    expect(mockFn).not.toHaveBeenCalled();
    await deferred();
    expect(mockFn).toHaveBeenCalledWith(42);
  });

  test("use deferCall with real function", async () => {
    const value1 = Math.random();
    const value2 = Math.random();
    const valuesSum = value1 + value2;

    const deferred = deferCall(sum, value1, value2);

    expect(deferred()).toEqual(valuesSum);
  });

  test("use deferCall with real async function", async () => {
    const value = Math.random();

    const deferred = deferCall(stupidFunction, value);

    expect(await deferred()).toEqual(value);
  });
});
