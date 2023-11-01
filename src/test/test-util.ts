import { AnyFunction } from 'bun';
import { Mock, expect } from 'bun:test';

// TODO: Bun does not support .toHaveBeenCalledWith() yet, https://github.com/oven-sh/bun/issues/1825
export const expectToHaveBeenCalledWith = (
  mock: Mock<AnyFunction>,
  ...expectedArgs: unknown[]
): void => {
  const calls = mock.mock.calls;
  expect(calls.length).toBeGreaterThan(0);

  const matchingCall = calls.find((call) =>
    call.some((arg) => expectedArgs.some((expectedArg) => Bun.deepEquals(expectedArg, arg)))
  );

  expect(matchingCall).toBeDefined();
};
