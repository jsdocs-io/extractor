// See https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#export--as-ns-syntax

// @ts-ignore
export * as external from "this-package-does-not-exist";
export * as foo from "./foo";
