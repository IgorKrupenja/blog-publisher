import { AnyFunction } from 'bun';
import { Mock } from 'bun:test';
import chalk from 'chalk';

// TODO: Bun does not support .toHaveBeenCalledWith() yet, https://github.com/oven-sh/bun/issues/1825
export const expectToHaveBeenCalledWith = (
  mock: Mock<AnyFunction>,
  ...expectedArgs: unknown[]
): void => {
  const calls = mock.mock.calls;

  // const match = calls.find((call) =>
  //   call.some((arg) => expectedArgs.some((expectedArg) => Bun.deepEquals(expectedArg, arg)))
  // );

  console.log(chalk.green(expectedArgs.toString()));

  let match = false;

  for (const call of calls) {
    console.log(chalk.yellow(call));
    console.log(chalk.blue(Bun.deepEquals(call, expectedArgs)));

    if (Bun.deepEquals(call, expectedArgs)) {
      match = true;
      break;
    }
  }

  // console.log(chalk.red('MATCH:', !!match));

  if (!match) {
    throw new Error(
      `\n\nExpected: ${chalk.green(expectedArgs.toString())}\nReceived: ${chalk.red(
        calls.toString()
      )}\n`
    );
  }
};
