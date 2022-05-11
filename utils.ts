// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

export type Child<T> = T | [T];

export function assert(
  cond: unknown,
  message = "Assertion error",
): asserts cond {
  if (!cond) {
    throw new Error(message);
  }
}

/** If the condition is true, return the `isTrue` value, other return `isFalse`
 * which defaults to `undefined`. */
export function maybe<T>(cond: unknown, isTrue: T): T | undefined;
/** If the condition is true, return the `isTrue` value, other return `isFalse`
 * which defaults to `undefined`. */
export function maybe<T, F>(cond: unknown, isTrue: T, isFalse: F): T | F;
/** If the condition is true, return the `isTrue` value, other return `isFalse`
 * which defaults to `undefined`. */
export function maybe<T, F>(
  cond: unknown,
  isTrue: T,
  isFalse?: F,
): T | F | undefined {
  return cond ? isTrue : isFalse;
}

/** A utility function that inspects a value, and if the value is an array,
 * returns the first element of the array, otherwise returns the value. This is
 * used to deal with the ambiguity around children properties with nano_jsx. */
export function take<T>(value: Child<T>, itemIsArray = false): T {
  if (itemIsArray) {
    return Array.isArray(value) && Array.isArray(value[0]) ? value[0] : // deno-lint-ignore no-explicit-any
      value as any;
  } else {
    return Array.isArray(value) ? value[0] : value;
  }
}
