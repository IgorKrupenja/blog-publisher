import { Mock, expect } from 'bun:test';

// TODO: Bun does not support .toHaveBeenCalledWith() yet, https://github.com/oven-sh/bun/issues/1825
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const expectToHaveBeenCalledWith = (mock: Mock<any>, expectedArgs: unknown[]): void => {
  const calls = mock.mock.calls;
  console.log('HUI HUI', mock.mock);
  const call = calls.find((c) => c.some((arg) => expectedArgs.includes(arg)));
  expect(call).toBeDefined();
};
