import { expect, test } from "vitest";
import {
  InstallPackageError,
  PackageNameError,
  PackageTypesError,
} from "./errors";
import { extractPackageApi } from "./extract-package-api";

test("invalid package name", async () => {
  const res = await extractPackageApi({ pkg: "" });
  expect(res.isErr()).toBe(true);
  expect(res._unsafeUnwrapErr() instanceof PackageNameError).toBe(true);
});

test("package not found", async () => {
  const res = await extractPackageApi({ pkg: "@jsdocs-io/not-found" });
  expect(res.isErr()).toBe(true);
  expect(res._unsafeUnwrapErr() instanceof InstallPackageError).toBe(true);
});

test("package types not found", async () => {
  const res = await extractPackageApi({ pkg: "unlicensed@0.4.0" });
  expect(res.isErr()).toBe(true);
  expect(res._unsafeUnwrapErr() instanceof PackageTypesError).toBe(true);
});

test("package successfully analyzed", async () => {
  const res = await extractPackageApi({ pkg: "short-time-ago@2.0.0" });
  expect(res.isOk()).toBe(true);
});
