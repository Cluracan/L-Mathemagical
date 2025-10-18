export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new Error(
      `Assertion error: expected ${String(val)} to be defined, but received ${String(val)}`
    );
  }
}
