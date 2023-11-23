/**
 * Enum1
 */
export const enum Enum1 {
  /** Positive */
  Yes,
  No,
}

export enum Enum2 {
  Ok = 1,
  Ko,
}

enum Enum3 {
  A = "A",
  B = "B",
  C = "C",
}

export { Enum3 };

export enum Enum4 {}

/** @internal */
export enum Enum5 {}

export enum Enum6 {
  A,
  /** @internal */
  B,
}
