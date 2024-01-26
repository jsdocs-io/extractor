import { expect, test } from "vitest";
import {
  FsError,
  InstallPackageError,
  OsError,
  PackageDeclarationsError,
  PackageJsonError,
  PackageNameError,
  PackageTypesError,
  ProjectError,
} from "./errors";

test("os error", () => {
  expect(() => {
    throw new OsError("test");
  }).toThrow();
});

test("fs error", () => {
  expect(() => {
    throw new FsError("test");
  }).toThrow();
});

test("install package error", () => {
  expect(() => {
    throw new InstallPackageError("test");
  }).toThrow();
});

test("package name error", () => {
  expect(() => {
    throw new PackageNameError("test");
  }).toThrow();
});

test("package json error", () => {
  expect(() => {
    throw new PackageJsonError("test");
  }).toThrow();
});

test("package types error", () => {
  expect(() => {
    throw new PackageTypesError("test");
  }).toThrow();
});

test("package declarations error", () => {
  expect(() => {
    throw new PackageDeclarationsError("test");
  }).toThrow();
});

test("project error", () => {
  expect(() => {
    throw new ProjectError("test");
  }).toThrow();
});
