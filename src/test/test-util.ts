import { Mock, expect } from 'bun:test';

// TODO: Bun does not support .toHaveBeenCalledWith() yet, https://github.com/oven-sh/bun/issues/1825
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const expectToHaveBeenCalledWith = (mock: Mock<any>, expectedArgs: any[]): void => {
  const calls = mock.mock.calls;
  const lastCall = calls[calls.length - 1];
  expect(lastCall).toEqual(expectedArgs);
};
