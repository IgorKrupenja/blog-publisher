import { AnyFunction } from 'bun';
import { Mock, expect } from 'bun:test';

// TODO: Bun does not support .toHaveBeenCalledWith() yet, https://github.com/oven-sh/bun/issues/1825
// todo try proper types?
export const expectToHaveBeenCalledWith = (
  mock: Mock<AnyFunction>,
  expectedArgs: unknown[]
): void => {
  const calls = mock.mock.calls;
  // console.log(calls);
  // const matchingCall = calls.find((call) => call.some((arg) => expectedArgs.includes(arg)));

  let matchingCall;
  for (const call of calls) {
    for (const arg of call) {
      let isArgIncluded = false;
      for (const expectedArg of expectedArgs) {
        if (typeof expectedArg !== 'object' && expectedArg === arg) {
          isArgIncluded = true;
          break;
        } else {
          isArgIncluded = Bun.deepEquals(expectedArg, arg);
        }
      }

      if (isArgIncluded) {
        matchingCall = call;
        break;
      }
    }

    if (matchingCall) {
      break;
    }
  }

  expect(matchingCall).toBeDefined();
};
