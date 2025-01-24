![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdmitrytarassov%2Fjust-defer-call%2Frefs%2Fheads%2Fmain%2Fpackage.json&query=%24.version&style=for-the-badge&label=just-defer-call&link=%24.repository)

```typescript
// Use this
onClick={deferCall(fn, ⭐, 🔥, 🚀)}
// Instead of this
onClick={() => fn(😭, 😢,😞)}
```

# `deferCall` Documentation

The `deferCall` utility is a higher-order function that defers the execution of a given function until the returned function is called. It supports synchronous and asynchronous functions.

## Installation
```shell
yarn add just-defer-call
# or
npm i just-defer-call
```

## Usage

### Signature
```typescript
export const deferCall =
  <T, Args extends unknown[]>(
    fn: (...args: Args) => T | Promise<T>,
    ...args: Args
  ): (() => T | Promise<T>) =>
    (): T | Promise<T> => {
      return fn(...args);
    };
```

### Parameters
- `fn`: The function to be deferred. It can be synchronous or asynchronous.
- `args`: The arguments to pass to `fn` when the deferred function is executed.

### Returns
A new function that, when called, invokes the original function `fn` with the provided arguments and returns the result of original `fn`.

---

## Examples

### Vanilla Example 1 - Simple deferred call
```javascript
import { deferCall } from "just-defer-call";

function greet(name) {
  console.log(`Hello, ${name}!`);
}

const deferredGreet = deferCall(greet, 'Alice');

// Function execution is deferred
deferredGreet(); // Logs: "Hello, Alice!"
```

### Vanilla Example 2 - pass as many arguments as you want
```javascript
import { deferCall } from "just-defer-call";

function max(...args) {
  console.log(`Max is: ${Math.max.apply(null, args)}!`);
}

const deferredMax = deferCall(max, 1, 2, 5, 4, 3);

// Function execution is deferred
deferredMax(); // Logs: "Max is: 5!"
```

### Vanilla Example 3 - onClick handler
```js
import { deferCall } from "just-defer-call";

function onClickHandler(buttonIndex) {
  alert(`Pressed button index: ${buttonIndex}`);
}

document.querySelectorAll("button").forEach((element, index) => {
  element.addEventListener('click', deferCall(onClickHandler, index));
});
```

### TypeScript Example
```typescript
import { deferCall } from "just-defer-call";

function add(a: number, b: number): number {
  return a + b;
}

const deferredAdd = deferCall(add, 5, 10);

// Function execution is deferred
console.log(deferredAdd()); // Logs: 15

async function fetchData(url: string): Promise<string> {
  const response = await fetch(url);
  return response.text();
}

const deferredFetch = deferCall(fetchData, 'https://api.example.com');

// Deferred execution of async function
deferredFetch().then(data => console.log(data));
```

### React Example
```tsx
import React, { useState } from 'react';

import { deferCall } from "just-defer-call";

function App() {
  const [count, setCount] = useState(0);

  const increment = (value: number) => {
    setCount((prev) => prev + value);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={deferCall(increment, 1)}>Increment</button>
    </div>
  );
}

export default App;
```

---

## Notes
- If `fn` is asynchronous, the returned function also returns a promise. Make sure to handle it appropriately.
- Useful for event handling, lazy evaluations, or deferring expensive computations.

---

## Testing

### Jest Test Case
```typescript
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
```