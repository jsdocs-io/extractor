import { expect, test } from "vitest";
import {
  InstallPackageError,
  PackageNameError,
  PackageTypesError,
} from "./errors";
import { extractPackageApi } from "./extract-package-api";

test("invalid package name", async () => {
  const startDir = process.cwd();
  const res = await extractPackageApi({ pkg: "" });
  expect(res.isErr()).toBe(true);
  expect(res._unsafeUnwrapErr() instanceof PackageNameError).toBe(true);
  expect(process.cwd()).toBe(startDir);
});

test("package not found", async () => {
  const startDir = process.cwd();
  const res = await extractPackageApi({ pkg: "@jsdocs-io/not-found" });
  expect(res.isErr()).toBe(true);
  expect(res._unsafeUnwrapErr() instanceof InstallPackageError).toBe(true);
  expect(process.cwd()).toBe(startDir);
});

test("package types not found", async () => {
  const startDir = process.cwd();
  const res = await extractPackageApi({ pkg: "unlicensed@0.4.0" });
  expect(res.isErr()).toBe(true);
  expect(res._unsafeUnwrapErr() instanceof PackageTypesError).toBe(true);
  expect(process.cwd()).toBe(startDir);
});

test("package successfully analyzed", async () => {
  const startDir = process.cwd();
  const res = await extractPackageApi({ pkg: "short-time-ago@2.0.0" });
  expect(res.isOk()).toBe(true);
  expect(process.cwd()).toBe(startDir);
});
