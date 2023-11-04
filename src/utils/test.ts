import { AnyFunction } from 'bun';
import { Mock } from 'bun:test';
import chalk from 'chalk';

// TODO: Bun does not support .toHaveBeenCalledWith() yet, https://github.com/oven-sh/bun/issues/1825
export const expectToHaveBeenCalledWith = (
  mock: Mock<AnyFunction>,
  ...expectedArgs: unknown[]
): void => {
  const calls = mock.mock.calls;

  const match = calls.some((call) => Bun.deepEquals(call, expectedArgs));

  if (!match) {
    throw new Error(
      `\n\nExpected: ${chalk.green(expectedArgs.toString())}\nReceived: ${chalk.red(
        calls.toString()
      )}\n`
    );
  }
};
